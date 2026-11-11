import { describe, expect, it } from "vitest";
import { estimateImport, importEstimateRange, type ImportEstimateInput } from "./import-estimate";
import { importCostConfig } from "./import-cost-config";

const example: ImportEstimateInput = { purchaseUsd: 10000, officialAuctionFeesUsd: 1000, provider: "copart", year: 2025, caftaConfirmed: false, co2Rate: 0.01, hybridIllustrative: false };

describe("Valcron import estimate", () => {
  it("calculates the approved operational breakdown without double-counting fees", () => {
    const result = estimateImport(example)!;
    expect(result.cif).toBe(12975);
    expect(result.tariff).toBe(2595);
    expect(result.itbis).toBeCloseTo(2802.6, 6);
    expect(result.firstPlate).toBeCloseTo(2205.75, 6);
    expect(result.co2).toBeCloseTo(129.75, 6);
    expect(result.marbeteDop).toBe(4000);
    expect(result.totalUsd).toBeCloseTo(21222.6161290323, 6);
    expect(result.lines.filter(line => line.key === "management")).toHaveLength(1);
  });
  it("never fabricates a commission when an official account table is unavailable", () => {
    expect(estimateImport({ ...example, officialAuctionFeesUsd: null })).toBeNull();
    expect(estimateImport({ ...example, provider: "iaai", officialAuctionFeesUsd: null })).toBeNull();
  });
  it("applies CAFTA only when explicitly selected, and adjusts the ITBIS base", () => {
    const result = estimateImport({ ...example, caftaConfirmed: true })!;
    expect(result.tariff).toBe(0);
    expect(result.itbis).toBeCloseTo(2335.5, 6);
    expect(result.totalUsd).toBeLessThan(estimateImport(example)!.totalUsd);
  });
  it("does not add the fuel surcharge twice", () => {
    expect(estimateImport(example)!.freight).toBe(1575);
    expect(estimateImport({ ...example, freightIncludesFuel: true })!.freight).toBe(1075);
  });
  it("uses the selected CO2 and model-year marbete, with the shared FX rate", () => {
    const result = estimateImport({ ...example, co2Rate: 0.03, year: 2021 })!;
    expect(result.co2).toBeCloseTo(389.25, 6);
    expect(result.marbeteDop).toBe(2000);
    expect(result.totalDop).toBeCloseTo(result.totalUsd * 62, 6);
  });
  it("keeps the hybrid scenario explicitly illustrative", () => {
    const result = estimateImport({ ...example, hybridIllustrative: true })!;
    expect(result.tariff).toBe(1297.5);
    expect(result.firstPlate).toBeCloseTo(1102.875, 6);
  });
  it("recalculates total ranges using the real inland range", () => {
    const range = importEstimateRange(example)!;
    const result = estimateImport(example)!;
    expect(range.minUsd).toBeLessThan(result.totalUsd);
    expect(range.maxUsd).toBeGreaterThan(result.totalUsd);
    const exact = importEstimateRange({ ...example, inlandUsd: 700 })!;
    expect(exact.minUsd).toBe(exact.maxUsd);
    expect(importCostConfig.inland).toEqual({ typicalUsd: 400, minUsd: 250, maxUsd: 900 });
  });
  it("rejects invalid or overflowing scenarios", () => {
    for (const price of [0, -1, NaN, Infinity]) expect(estimateImport({ ...example, purchaseUsd: price })).toBeNull();
    expect(estimateImport({ ...example, co2Rate: 0.99 })).toBeNull();
    expect(estimateImport({ ...example, inlandUsd: -1 })).toBeNull();
    expect(estimateImport({ ...example, officialAuctionFeesUsd: Number.MAX_VALUE })).toBeNull();
  });
});
