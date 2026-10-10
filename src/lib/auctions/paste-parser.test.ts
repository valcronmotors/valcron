import { describe, expect, it } from "vitest";
import { parseAuctionPasteText, parsedFieldsToFormPatch } from "@/lib/auctions/paste-parser";

const HONDA_CRV_COPART = `2026 HONDA CR-V SPORT TOURING
Run and Drive
VIN:7FARS6H97TE******
Lot number:60659246
Lane/Item:
-/-
Sale name:
TN - MEMPHIS
Location:
TN - MEMPHIS
Engine starts
Copart verified that the engine starts.
Transmission engages
Copart verified that the transmission engages.
Order condition report
Title code:
TX -
Salvage Vehicle Title
Odometer:
1,882 mi
Actual
Primary damage:
Normal Wear
Estimated retail value:
$41,022.00USD
Cylinders:
4
Color:
Gray
Has key:
Yes
Engine type:
2.0L 4
Transmission:
Automatic
Vehicle type:
Automobile
Drivetrain:
ALL WHEEL DRIVE
Fuel:
Electric And Gas Hybrid
Body style:
Sport Utility Vehicle
Sale date:
Tue. Oct 13, 2026 01:00 PM EDT
Highlights:
Run and Drive
Notes:
There are no notes for this lot`;

const IAA_SAMPLE = `2019 TOYOTA CAMRY SE
Lot #: 12345678
VIN: 4T1B11HK5KU123456
Location: CA - LOS ANGELES
Primary Damage: Front End
Secondary Damage: None
Odometer: 45,210 mi Actual
Keys: No
Fuel Type: Gasoline
Transmission: Automatic
Drivetrain: FWD
IAA Branch: Los Angeles`;

const MANHEIM_SAMPLE = `2021 FORD F-150 XLT
Manheim Lane: A
Work Order / Lot: 99001122
VIN: 1FTEW1E49MFA12345
Location: FL - ORLANDO
Odometer: 62,400 miles
Condition: Normal Wear
Sale Date: 2026-11-02
Buy Now: $18,500 USD
Transmission: Automatic
Drivetrain: 4WD
Fuel: Gas`;

describe("parseAuctionPasteText Copart Honda CR-V fixture", () => {
  it("extracts the mandatory Honda CR-V fields", () => {
    const result = parseAuctionPasteText(HONDA_CRV_COPART);
    const get = (key: string) => result.byKey[key as keyof typeof result.byKey]?.value;

    expect(get("year")).toBe("2026");
    expect(get("make")).toBe("Honda");
    expect(get("model")).toBe("CR-V");
    expect(get("trim")?.toLowerCase()).toContain("sport");
    expect(get("trim")?.toLowerCase()).toContain("touring");
    expect(get("provider_lot_id")).toBe("60659246");
    expect(get("location")).toBe("TN - MEMPHIS");
    expect(get("vin")).toBe("7FARS6H97TE******");
    expect(get("vin_status")).toMatch(/Masked|incomplete/i);
    expect(get("mileage")).toBe("1882");
    expect(get("mileage_unit")).toBe("mi");
    expect(get("odometer_status")).toBe("Actual");
    expect(get("primary_damage")).toBe("Normal Wear");
    expect(get("estimated_retail_usd")).toBe("41022");
    expect(get("engine")).toMatch(/2\.0L/i);
    expect(get("cylinders")).toBe("4");
    expect(get("exterior_color")).toBe("Gray");
    expect(get("keys")).toBe("Yes");
    expect(get("transmission")).toBe("Automática");
    expect(get("drivetrain")).toBe("AWD");
    expect(get("fuel")).toMatch(/Hybrid/i);
    expect(get("body_style")).toBe("SUV");
    expect(get("title_status")).toMatch(/TX/i);
    expect(get("title_status")).toMatch(/Salvage/i);
    expect(get("auction_date")).toBe("2026-10-13");
    expect(get("run_and_drive")).toMatch(/Run and Drive/i);
    expect(get("engine_starts")).toMatch(/Reported/i);
    expect(get("transmission_engages")).toMatch(/Reported/i);
    expect(get("notes")).toMatch(/No notes/i);
    expect(get("price_mode")).toBe("contact");
    expect(result.providerHint).toBe("copart");
    expect(result.warnings.some((warning) => /Run and Drive/i.test(warning))).toBe(true);
    expect(result.warnings.some((warning) => /informativo|estimado/i.test(warning))).toBe(true);
  });

  it("does not treat estimated retail as Buy Now or invent a public price", () => {
    const result = parseAuctionPasteText(HONDA_CRV_COPART);
    expect(result.byKey.buy_now_usd).toBeUndefined();
    expect(result.byKey.price_mode?.value).toBe("contact");
    const patch = parsedFieldsToFormPatch(result);
    expect(patch.price_mode).toBe("contact");
    expect(patch.buy_now_usd).toBeUndefined();
  });

  it("does not treat a masked VIN as complete", () => {
    const result = parseAuctionPasteText(HONDA_CRV_COPART);
    expect(result.byKey.vin_status?.value).toMatch(/Masked|incomplete/i);
    expect(result.byKey.vin?.confidence).toBe("review");
  });
});

describe("parseAuctionPasteText IAA and Manheim", () => {
  it("parses IAA-style labels", () => {
    const result = parseAuctionPasteText(IAA_SAMPLE);
    expect(result.byKey.year?.value).toBe("2019");
    expect(result.byKey.make?.value).toBe("Toyota");
    expect(result.byKey.model?.value).toMatch(/CAMRY/i);
    expect(result.byKey.provider_lot_id?.value).toBe("12345678");
    expect(result.byKey.location?.value).toMatch(/LOS ANGELES/i);
    expect(result.byKey.primary_damage?.value).toMatch(/Front End/i);
    expect(result.byKey.keys?.value).toBe("No");
    expect(result.providerHint).toBe("iaa");
  });

  it("parses Manheim-style labels and Buy Now without assuming it as default price mode", () => {
    const result = parseAuctionPasteText(MANHEIM_SAMPLE);
    expect(result.byKey.year?.value).toBe("2021");
    expect(result.byKey.make?.value).toBe("Ford");
    expect(result.byKey.model?.value).toBe("F-150");
    expect(result.byKey.provider_lot_id?.value).toBe("99001122");
    expect(result.byKey.buy_now_usd?.value).toBe("18500");
    expect(result.byKey.price_mode?.value).toBe("contact");
    expect(result.providerHint).toBe("manheim");
    expect(result.byKey.drivetrain?.value).toBe("4WD");
  });

  it("leaves missing labels unfilled and does not invent values", () => {
    const result = parseAuctionPasteText("Lot number: 111\nYear: 2020");
    expect(result.byKey.provider_lot_id?.value).toBe("111");
    expect(result.byKey.make).toBeUndefined();
    expect(result.byKey.model).toBeUndefined();
    expect(result.byKey.buy_now_usd).toBeUndefined();
  });

  it("strips HTML-like content and does not execute markup", () => {
    const result = parseAuctionPasteText(`<script>alert(1)</script>\n2022 KIA SPORTAGE LX\nLot number: 55`);
    expect(result.byKey.year?.value).toBe("2022");
    expect(result.byKey.make?.value).toBe("Kia");
    expect(JSON.stringify(result)).not.toMatch(/<script>/i);
  });
});

describe("auction paste conflict helpers", () => {
  it("maps parsed fields into a form patch without overwriting strategy", () => {
    const patch = parsedFieldsToFormPatch(parseAuctionPasteText(HONDA_CRV_COPART));
    expect(patch.provider_lot_id).toBe("60659246");
    expect(patch.location).toBe("TN - MEMPHIS");
    expect(patch.mileage).toBe("1882");
    expect(patch.price_mode).toBe("contact");
  });
});
