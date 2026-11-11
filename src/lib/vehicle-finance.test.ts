import { describe, expect, it } from "vitest";
import { financeEstimate } from "./vehicle-finance";
import { monthlyPayment } from "./public-filters";
import { financeConfig } from "./finance-config";
import { DEFAULT_TASA_USD_DOP } from "./fx";

describe("listing financing estimates", () => {
  it("uses the calculator's shared rate, term and default initial", () => {
    const estimate = financeEstimate(27900)!;
    expect(estimate.downPaymentDop).toBe(27900 * DEFAULT_TASA_USD_DOP * financeConfig.defaultDownPaymentPct / 100);
    expect(estimate.monthlyDop).toBeCloseTo(monthlyPayment(27900 * 0.8, 48, 0.16) * DEFAULT_TASA_USD_DOP, 6);
    expect(estimate.explicitDownPayment).toBe(false);
  });
  it("uses Gabriel's approved RD$300,000 initial without changing the US$26,900 price", () => {
    const estimate = financeEstimate(26900, 300000)!;
    expect(estimate.downPaymentDop).toBe(300000);
    expect(estimate.monthlyDop).toBeCloseTo(monthlyPayment(26900 * DEFAULT_TASA_USD_DOP - 300000, 48, 0.16), 6);
    expect(estimate.explicitDownPayment).toBe(true);
  });
  it("recalculates with client-selected annual interest and one to seven years", () => {
    for (const months of [12, 84]) for (const annualRate of [0.08, 0.30]) {
      const estimate = financeEstimate(26900, 400000, months, annualRate)!;
      expect(estimate.annualRate).toBe(annualRate);
      expect(estimate.monthlyDop).toBeCloseTo(monthlyPayment(26900 * DEFAULT_TASA_USD_DOP - 400000, months, annualRate), 6);
    }
    for (const rate of [NaN, Infinity, 0.079, 0.301]) expect(financeEstimate(26900, 300000, 48, rate)).toBeNull();
  });
  it("does not advertise payments for invalid prices or initials", () => {
    for (const price of [0, -1, NaN, Infinity]) expect(financeEstimate(price)).toBeNull();
    expect(financeEstimate(26900, -1)).toBeNull();
    expect(financeEstimate(26900, 26900 * DEFAULT_TASA_USD_DOP)).toBeNull();
  });
});
