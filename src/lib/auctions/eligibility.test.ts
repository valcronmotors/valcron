import { describe, expect, it } from "vitest";
import {
  evaluateAuctionEligibility,
  evaluateDamageEligibility,
  evaluateOdometerEligibility,
  evaluateRunAndDriveEligibility,
  evaluateTitleEligibility,
  evaluateVinEligibility,
  normalizeVin,
  vinCheckDigitValid,
} from "@/lib/auctions/eligibility";

/** Check-digit-valid VINs for allowed prefixes (generated/verified). */
const VIN_1 = "1HGCM82633A004352";
const VIN_1B = "1G1ZT53826F109149";
const VIN_4 = "4T1BF1FK6CU031882";
const VIN_5 = "5FNRL38639B041844";
const VIN_5B = "5YJSA1E18HF000001";
const VIN_7 = "7FARW2H89KE029825";

function assertValidAllowedVin(vin: string) {
  expect(normalizeVin(vin)).toHaveLength(17);
  expect(["1", "4", "5", "7"]).toContain(vin[0]);
  expect(vinCheckDigitValid(vin)).toBe(true);
}

describe("VIN eligibility", () => {
  it("approves complete VINs beginning with 1, 4, 5, or 7", () => {
    const samples = [VIN_1, VIN_1B, VIN_4, VIN_5, VIN_5B, VIN_7];
    expect(samples.every(vinCheckDigitValid)).toBe(true);
    for (const vin of samples) {
      assertValidAllowedVin(vin);
      const result = evaluateVinEligibility(vin);
      expect(result.verdict).toBe("approved");
      expect(result.reason).toBeNull();
    }
  });

  it("blocks disallowed VIN prefixes", () => {
    const candidate = "2HGCM82633A004352";
    const result = evaluateVinEligibility(candidate);
    expect(result.verdict).toBe("blocked");
    expect(result.reason).toMatch(/no comienza con 1, 4, 5 o 7/i);
  });

  it("requires review for masked, short, or invalid VINs", () => {
    expect(evaluateVinEligibility("7FARS6H97TE******").verdict).toBe("review");
    expect(evaluateVinEligibility("7FARS6H97TE******").reason).toMatch(/VIN incompleto/i);
    expect(evaluateVinEligibility("1HGCM82633").verdict).toBe("review");
    expect(evaluateVinEligibility("").verdict).toBe("review");
    expect(evaluateVinEligibility("1HGCM82633A00435I").verdict).toBe("review"); // I illegal
  });

  it("requires review when check digit fails", () => {
    const bad = "1HGCM82633A004353";
    expect(vinCheckDigitValid(bad)).toBe(false);
    expect(evaluateVinEligibility(bad).verdict).toBe("review");
  });
});

describe("title eligibility", () => {
  it("approves clean and salvage titles", () => {
    expect(evaluateTitleEligibility("Clean Title").verdict).toBe("approved");
    expect(evaluateTitleEligibility("Salvage Title").verdict).toBe("approved");
    expect(evaluateTitleEligibility("TX — Salvage Vehicle Title").verdict).toBe("approved");
  });

  it("blocks prohibited title types without false positives", () => {
    for (const title of [
      "Certificate of Destruction",
      "JUNK",
      "Parts Only",
      "Non-Repairable",
      "Bill of Sale",
    ]) {
      const result = evaluateTitleEligibility(title);
      expect(result.verdict).toBe("blocked");
      expect(result.reason).toMatch(/documento no permitido/i);
    }
    expect(evaluateTitleEligibility("Salvage").verdict).toBe("approved");
  });

  it("requires review for missing or unknown titles", () => {
    expect(evaluateTitleEligibility("").verdict).toBe("review");
    expect(evaluateTitleEligibility("Unknown").verdict).toBe("review");
    expect(evaluateTitleEligibility("Unrecognized Title XYZ").verdict).toBe("review");
    expect(evaluateTitleEligibility("Unknown Export Document").verdict).toBe("review");
  });
});

describe("odometer eligibility", () => {
  it("approves Actual and Actual Mileage only", () => {
    expect(evaluateOdometerEligibility("Actual").verdict).toBe("approved");
    expect(evaluateOdometerEligibility("Actual Mileage").verdict).toBe("approved");
  });

  it("blocks non-actual statuses and missing values", () => {
    for (const status of ["Not Actual", "Exempt", "Unknown", "Odometer Discrepancy", "Mileage Not Verified", ""]) {
      const result = evaluateOdometerEligibility(status);
      expect(result.verdict === "blocked" || result.verdict === "review").toBe(true);
      expect(result.reason).toMatch(/Actual/i);
    }
  });
});

describe("damage eligibility", () => {
  it("blocks prohibited primary and secondary damage", () => {
    for (const damage of [
      "Water / Flood",
      "Flood",
      "Water",
      "Burn",
      "Burn - Engine",
      "Burn - Interior",
      "Partial / Incomplete Repair",
      "Rejected Repair",
    ]) {
      expect(evaluateDamageEligibility(damage, "primary_damage").verdict).toBe("blocked");
      expect(evaluateDamageEligibility(damage, "secondary_damage").verdict).toBe("blocked");
    }
  });

  it("approves Normal Wear and None / Not Reported secondary", () => {
    expect(evaluateDamageEligibility("Normal Wear", "primary_damage").verdict).toBe("approved");
    expect(evaluateDamageEligibility("None", "secondary_damage").verdict).toBe("approved");
    expect(evaluateDamageEligibility("Not Reported", "secondary_damage").verdict).toBe("approved");
  });

  it("requires review when damage is missing", () => {
    expect(evaluateDamageEligibility("", "primary_damage").verdict).toBe("review");
    expect(evaluateDamageEligibility("Not Reported", "primary_damage").verdict).toBe("review");
  });
});

describe("run and drive eligibility", () => {
  it("requires explicit Run and Drive", () => {
    expect(evaluateRunAndDriveEligibility("Reported Run and Drive").verdict).toBe("approved");
    expect(evaluateRunAndDriveEligibility("Run and Drive").verdict).toBe("approved");
    expect(evaluateRunAndDriveEligibility("Not Run and Drive").verdict).toBe("blocked");
    expect(evaluateRunAndDriveEligibility("Run and Drive: No").verdict).toBe("blocked");
    expect(evaluateRunAndDriveEligibility("Run and Drive Not Verified").verdict).toBe("blocked");
  });

  it("blocks missing, unknown, not running, and partial mechanical flags", () => {
    for (const value of [
      "",
      "Not Reported",
      "Not Running",
      "Starts",
      "Enhanced Vehicle",
      "Engine Starts",
      "Transmission Engages",
    ]) {
      expect(evaluateRunAndDriveEligibility(value).verdict).toBe("blocked");
    }
  });
});

describe("overall eligibility", () => {
  it("marks Honda CR-V masked VIN fixture as REVIEW REQUIRED even with Normal Wear + R&D", () => {
    const result = evaluateAuctionEligibility({
      vin: "7FARS6H97TE******",
      title_status: "TX — Salvage Vehicle Title",
      odometer_status: "Actual",
      primary_damage: "Normal Wear",
      secondary_damage: "Not Reported",
      run_and_drive: "Reported Run and Drive",
    });
    expect(result.overall).toBe("review_required");
    expect(result.canPublish).toBe(false);
    expect(result.checks.find((check) => check.id === "vin")?.verdict).toBe("review");
    expect(result.overallLabel).toBe("REQUIERE REVISIÓN");
  });

  it("is eligible only when every check is approved", () => {
    const result = evaluateAuctionEligibility({
      vin: VIN_1,
      title_status: "Salvage Title",
      odometer_status: "Actual",
      primary_damage: "Normal Wear",
      secondary_damage: "None",
      run_and_drive: "Run and Drive",
    });
    expect(result.overall).toBe("eligible");
    expect(result.canPublish).toBe(true);
    expect(result.overallLabel).toBe("APROBADO");
  });

  it("blocks when a prohibited title is present", () => {
    const result = evaluateAuctionEligibility({
      vin: VIN_1,
      title_status: "Certificate of Destruction",
      odometer_status: "Actual",
      primary_damage: "Normal Wear",
      secondary_damage: "None",
      run_and_drive: "Run and Drive",
    });
    expect(vinCheckDigitValid(VIN_1)).toBe(true);
    expect(result.overall).toBe("blocked");
    expect(result.canPublish).toBe(false);
  });
});
