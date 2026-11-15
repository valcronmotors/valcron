import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  IMPORT_TAX_TABLE_URL,
  IMPORT_TAX_TABLE_COUNTS,
} from "./import-tax-manifest";
import {
  decodeImportTaxTable,
  preselectVin,
  specificationLabel,
  type ImportTaxRow,
} from "./import-tax-table";
import {
  estimateImport,
  newImportCandidate,
  clientQuoteLines,
  previewImportCosts,
} from "./import-estimate";
const rows = decodeImportTaxTable(
  JSON.parse(readFileSync(`public${IMPORT_TAX_TABLE_URL}`, "utf8")),
);
const honda = rows.find(
  (r) =>
    r.make === "HONDA" &&
    r.model === "CRV" &&
    r.year === 2023 &&
    r.country === "ESTADOS UNIDOS" &&
    r.series === "LX" &&
    r.drive === "AWD" &&
    r.taxUsd === 6708,
)!;
const dodge = rows.find(
  (r) =>
    r.make === "DODGE" &&
    r.model === "DURANGO" &&
    r.year === 2025 &&
    r.series === "SRT HELLCAT" &&
    r.taxUsd === 38851,
)!;
const candidate = (r: ImportTaxRow) => ({
  ...newImportCandidate("test"),
  ...r,
  id: "test",
  taxRow: r,
  purchaseUsd: 11500,
  freightUsd: 1150, // Preserve the existing example’s explicitly quoted freight.
});
describe("CSV-backed tax table", () => {
  it("preserves all 15 original columns and removes only identical rows", () => {
    const original = readFileSync("tabla-impuestos-placa.csv", "utf8")
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((s) => s.split(";"));
    expect(original).toHaveLength(9067);
    expect(rows).toHaveLength(9053);
    expect(IMPORT_TAX_TABLE_COUNTS.duplicates).toBe(14);
    const unique = new Set(original.map((r) => JSON.stringify(r)));
    for (const r of rows)
      expect(
        unique.has(
          JSON.stringify([
            r.make,
            r.model,
            String(r.year),
            r.country,
            r.series,
            r.fuel,
            r.cylinders,
            r.cc,
            r.passengers,
            r.doors,
            r.drive,
            r.cabins,
            r.loadWeight,
            r.axles,
            String(r.taxUsd),
          ]),
        ),
      ).toBe(true);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
    expect(new Set(rows.map((r) => r.make)).size).toBe(13);
  });
  it("uses Honda6708 and Dodge38851 once, replacing all formula tax/plate amounts", () => {
    for (const row of [honda, dodge]) {
      expect(row).toBeDefined();
      const v = candidate(row);
      const r = estimateImport(v)!;
      expect(r.taxAmount).toBe(row.taxUsd);
      expect(r.officialTax).toBe(true);
      expect(
        r.lines.filter((l) => ["dga", "dgii"].includes(l.key)),
      ).toHaveLength(0);
      expect(r.lines.filter((l) => l.key === "official-tax")).toHaveLength(1);
      expect(
        clientQuoteLines(v).filter((l) => l.key === "official-tax")[0].usd,
      ).toBe(row.taxUsd);
      expect(r.lines.reduce((sum, l) => sum + l.usd, 0)).toBeCloseTo(
        r.totalUsd,
        8,
      );
    }
  });
  it("balances the supplied Honda case and fee without duplicate management or taxes", () => {
    const r = estimateImport(candidate(honda))!;
    expect(r.fees.total).toBe(1409);
    expect(r.lines.some((l) => l.key === "autohall")).toBe(false);
    expect(r.insurance).toBe(230);
    expect(r.subtotal).toBe(21387);
    expect(r.dealerFee).toBe(1000);
    expect(r.repairFee).toBe(0);
    expect(r.totalUsd).toBeCloseTo(22980.3399111988, 6);
    expect(r.totalDop).toBeCloseTo(1397434.47, 2);
    expect(r.lines.filter((l) => l.key === "usa-management")).toHaveLength(1);
  });
  it("does not silently use formulas or keep a stale row after changing identity", () => {
    const v = candidate(honda);
    expect(estimateImport({ ...v, taxRow: null })).toBeNull();
    expect(estimateImport({ ...v, year: 2024 })).toBeNull();
    expect(estimateImport({ ...v, drive: "FWD" })).toBeNull();
    expect(previewImportCosts({ ...v, taxRow: null })!.taxAmount).toBeNull();
    expect(
      estimateImport({ ...v, taxMode: "manual", taxRow: null })!.officialTax,
    ).toBe(false);
  });
  it("does not charge the repair fee unless BOTH conditions are true", () => {
    const v = candidate(honda);
    for (const repairUsd of [0, 1000])
      for (const rebuiltManagement of [false, true])
        expect(
          estimateImport({ ...v, repairUsd, rebuiltManagement })!.repairFee,
        ).toBe(repairUsd > 0 && rebuiltManagement ? 400 : 0);
  });
  it("uses 2% PURCHASE insurance even if manual reference FOB differs", () => {
    const r = estimateImport({
      ...candidate(honda),
      taxMode: "manual",
      valuation: "table",
      tableFobUsd: 20000,
    })!;
    expect(r.insurance).toBe(230);
    expect(r.cif).toBe(21380);
  });
  it("preselects NHTSA aliases without guessing a specification and includes pickup data", () => {
    expect(
      preselectVin(rows, {
        make: "Honda",
        model: "CR-V",
        year: 2023,
        country: "USA",
      }),
    ).toEqual({ make: "HONDA", model: "CRV", country: "ESTADOS UNIDOS" });
    const pickup = rows.find((r) => r.cabins && r.loadWeight && r.axles)!;
    expect(pickup).toBeDefined();
    const label = specificationLabel(pickup);
    expect(label).toContain(pickup.country);
    expect(label).toContain(`${pickup.cabins} cabinas`);
    expect(label).toContain(pickup.loadWeight);
    expect(label).toContain(`${pickup.axles} ejes`);
  });
});
