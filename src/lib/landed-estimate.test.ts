import { describe, expect, it } from "vitest";
import { parseLandedEstimate, validatedLandedEstimate, landedEstimateLabel } from "./landed-estimate";

describe("validated landed estimates", () => {
  it("only publishes an explicitly validated, positive auction estimate", () => {
    const row = { source_type: "other", landed_estimate_usd: 35900, landed_estimate_validated: true };
    expect(validatedLandedEstimate(row)).toBe(35900);
    expect(validatedLandedEstimate({ ...row, landed_estimate_validated: false })).toBeNull();
    expect(validatedLandedEstimate({ ...row, source_type: "valcron_stock" })).toBeNull();
    expect(validatedLandedEstimate({ ...row, landed_estimate_usd: null })).toBeNull();
    expect(landedEstimateLabel(35900)).toBe("Desde US$35,900 puesto en RD — precio estimado");
  });
  it("rejects invalid amounts and validation without an amount", () => {
    for (const raw of ["-5", "0", "NaN", "Infinity", "1e99"]) expect(parseLandedEstimate(raw, true).error).toBeTruthy();
    expect(parseLandedEstimate("", true).error).toBeTruthy();
    expect(parseLandedEstimate("", false).data).toEqual({ landed_estimate_usd: null, landed_estimate_validated: false });
    expect(parseLandedEstimate("35900", true).data).toEqual({ landed_estimate_usd: 35900, landed_estimate_validated: true });
  });
});
