import { describe, expect, it } from "vitest";
import {
  auctionFeesForPrice,
  clientQuoteLines,
  bestCandidate,
  estimateImport,
  newImportCandidate,
  type ImportCandidate,
} from "./import-estimate";
import { parseVpic } from "./import-vin";
const example: ImportCandidate = {
  ...newImportCandidate("a"),
  make: "Honda",
  model: "CR-V",
  country: "USA",
  year: 2025,
  purchaseUsd: 10000,
  freightUsd: 1150, // Preserve the existing example’s explicitly quoted freight.
  taxMode: "manual",
};
describe("Calculadora única Valcron", () => {
  it("balances the approved full USD and DOP quotation without duplicate CIF charges", () => {
    const r = estimateImport(example)!;
    expect(r.cif).toBe(11350);
    expect(r.insurance).toBe(200);
    expect(r.tariff).toBe(0);
    expect(r.itbis).toBe(2043);
    expect(r.plate).toBeCloseTo(1929.5);
    expect(r.co2).toBe(113.5);
    expect(r.fees.total).toBe(1409);
    expect(r.subtotal).toBeCloseTo(17300.778654826507, 6);
    expect(r.dealerFee).toBe(1000);
    expect(r.totalUsd).toBeCloseTo(18894.118566025325, 6);
    expect(r.totalDop).toBeCloseTo(r.totalUsd * 60.81, 6);
    expect(r.lines.reduce((sum, l) => sum + l.usd, 0)).toBeCloseTo(
      r.totalUsd,
      8,
    );
    expect(
      clientQuoteLines(example).some((l) =>
        /Auto Hall|Repair Fee|Dealer Fee|Custom Fee/.test(l.label),
      ),
    ).toBe(false);
  });
  it("charges unloading/HIT only for container shipping, including grouped totals", () => {
    const a = estimateImport(example)!;
    const b = estimateImport({ ...example, shippingMethod: "roro" })!;
    expect(a.unloading).toBe(140);
    expect(b.unloading).toBe(0);
    expect(b.lines.some((l) => l.key === "unloading")).toBe(false);
    expect(a.totalUsd - b.totalUsd).toBeCloseTo(140);
    expect(b.lines.reduce((sum, l) => sum + l.usd, 0)).toBeCloseTo(b.totalUsd);
  });
  it("uses table FOB for taxes while keeping actual purchase cost in the total", () => {
    const r = estimateImport({
      ...example,
      valuation: "table",
      tableFobUsd: 20000,
      country: "JAPAN",
    })!;
    expect(r.fob).toBe(20000);
    expect(r.cif).toBe(21350);
    expect(r.tariff).toBe(4270);
    expect(r.itbis).toBeCloseTo(4611.6);
    expect(r.lines[0].usd).toBe(10000);
    expect(
      estimateImport({ ...example, valuation: "table", tableFobUsd: null })!
        .cif,
    ).toBe(11350);
  });
  it("handles auction boundaries including cents and IAAI internet cap", () => {
    for (const [price, buyer] of [
      [0, 25],
      [49.99, 25],
      [50, 45],
      [999.99, 320],
      [1000, 375],
      [14999.99, 1000],
      [15000, 1125],
    ] as const)
      expect(auctionFeesForPrice(price, "copart").buyer).toBe(buyer);
    expect(auctionFeesForPrice(999.99, "copart").internet).toBe(79);
    expect(auctionFeesForPrice(1000, "copart").internet).toBe(99);
    expect(auctionFeesForPrice(8000, "copart").internet).toBe(279);
    expect(auctionFeesForPrice(8000, "iaai")).toEqual({
      buyer: 925,
      internet: 160,
      fixed: 140,
      total: 1225,
    });
  });
  it("charges repair management only with repair and title check, without Auto Hall charges", () => {
    const base = estimateImport(example)!;
    for (const purchaseUsd of [10000, 60000, 60001]) {
      const noRepair = estimateImport({ ...example, purchaseUsd })!;
      const repair = estimateImport({
        ...example,
        purchaseUsd,
        repairUsd: 1000,
      })!;
      const rebuilt = estimateImport({
        ...example,
        purchaseUsd,
        repairUsd: 1000,
        rebuiltManagement: true,
      })!;
      expect(repair.subtotal - noRepair.subtotal).toBeCloseTo(1000);
      expect(rebuilt.subtotal).toBeCloseTo(repair.subtotal);
      expect(rebuilt.totalUsd - repair.totalUsd).toBeCloseTo(400);
      expect(repair.repairFee).toBe(0);
      for (const result of [noRepair, repair, rebuilt]) {
        expect(
          result.lines.some((l) => /auto.?hall/i.test(l.key + l.label)),
        ).toBe(false);
        expect(result.lines.reduce((sum, l) => sum + l.usd, 0)).toBeCloseTo(
          result.totalUsd,
        );
      }
    }
    expect(
      estimateImport({ ...example, rebuiltManagement: true })!.totalUsd,
    ).toBe(base.totalUsd);
    expect(clientQuoteLines(example).find((l) => l.key === "auction")).toEqual({
      key: "auction",
      label: "Fees de subasta",
      usd: 1409,
    });
    expect(
      clientQuoteLines(example).reduce((sum, l) => sum + l.usd, 0),
    ).toBeCloseTo(base.totalUsd);
  });
  it("uses each candidate exchange rate and model-year marbete and correct CAFTA savings", () => {
    const r = estimateImport({ ...example, year: 2021, fx: 50 })!;
    expect(r.marbeteDop).toBe(2000);
    expect(r.totalDop).toBeCloseTo(r.totalUsd * 50);
    const other = estimateImport({ ...example, country: "JAPAN" })!;
    expect(estimateImport(example)!.caftaSavings).toBeCloseTo(
      other.tariff + other.itbis - estimateImport(example)!.itbis,
    );
  });
  it("ranks only valid candidates and prioritizes the sweet spot", () => {
    const sweet = { ...example, id: "sweet", purchaseUsd: 20000 };
    const cheaper = { ...example, id: "cheap", purchaseUsd: 5000 };
    expect(estimateImport(sweet)!.sweetSpot).toBe(true);
    expect(bestCandidate([cheaper, sweet])).toBe("sweet");
    expect(bestCandidate([cheaper, { ...sweet, year: 2020 }])).toBe("cheap");
    expect(bestCandidate([{ ...example, year: 2020 }])).toBeUndefined();
  });
  it("blocks missing identification, pre-2021 years and invalid numeric inputs", () => {
    for (const patch of [
      { year: 2020 },
      { year: NaN },
      { purchaseUsd: 0 },
      { purchaseUsd: Infinity },
      { fx: 0 },
      { repairUsd: -1 },
      { co2Percent: 4 },
      { make: "" },
      { country: "" },
      { valuation: "table", tableFobUsd: -1 },
    ] as Partial<ImportCandidate>[])
      expect(estimateImport({ ...example, ...patch })).toBeNull();
  });
  it("maps only returned NHTSA data and does not infer USA from missing plant country", () => {
    const r = parseVpic({
      Make: "HONDA",
      Model: "CR-V",
      ModelYear: "2025",
      PlantCountry: "UNITED STATES (USA)",
      DisplacementL: "2.0",
      EngineCylinders: "4",
      FuelTypePrimary: "Gasoline",
      Trim: "EX",
      DriveType: "AWD",
      Seats: "5",
      Doors: "4",
    });
    expect(r).toMatchObject({
      make: "Honda",
      model: "CR-V",
      year: 2025,
      country: "USA",
      cc: "2000",
      cylinders: "4",
      series: "EX",
      passengers: "5",
      doors: "4",
      drive: "AWD",
    });
    expect(
      parseVpic({ Make: "BMW", Model: "X5", ModelYear: "2024" }).country,
    ).toBe("");
  });
});
