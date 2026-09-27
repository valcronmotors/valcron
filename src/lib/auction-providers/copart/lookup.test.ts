import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  COPART_DUPLICATE_LOT_MESSAGE,
  copartOpportunityInsert,
} from "@/lib/auction-providers/copart/opportunity";
import {
  COPART_LOT_NOT_FOUND_MESSAGE,
  copartFormHasManualEdits,
  copartFormValuesFromInsert,
  copartLookupAllowsSnapshotStatus,
  copartLookupSummary,
  copartPrefillFromVehicle,
  copartPrefillOmitsPublicPrice,
  resolveCopartLotLookupInput,
  shouldConfirmCopartLookupReplace,
} from "@/lib/auction-providers/copart/lookup";
import { copartCardImageUrl, isCopartImageManifestUrl } from "@/lib/auction-providers/copart/images";
import { opportunityToVehicleDraft } from "@/lib/auctions/prepare-website";
import type { AuctionSearchVehicle } from "@/lib/auction-providers/types";

const GALLERY = [
  "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0001/full-a.jpg",
  "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0001/full-b.jpg",
];

function vehicle(overrides: Partial<AuctionSearchVehicle> = {}): AuctionSearchVehicle {
  return {
    provider: "copart",
    lotNumber: "90000001",
    vin: "JTMRWRFV0MD123456",
    year: 2023,
    make: "TOYOTA",
    model: "RAV4",
    modelDetail: "RAV4",
    trim: "XLE",
    mileage: 41200,
    mileageUnit: "mi",
    bodyStyle: "SUV",
    color: "WHITE",
    primaryDamage: "FRONT END",
    secondaryDamage: null,
    titleState: "FL",
    titleType: "SC",
    hasKeys: true,
    engine: "2.5L 4",
    drive: "ALL WHEEL DRIVE",
    transmission: "AUTOMATIC",
    fuel: "GAS",
    cylinders: "4",
    runCondition: "Run & Drive Verified",
    saleStatus: "On Minimum Bid",
    location: "MIAMI, FL",
    locationCity: "MIAMI",
    locationState: "FL",
    saleDate: "2026-10-02",
    saleTime: "12:00",
    estimatedRetailValue: 22000,
    repairCost: 4100,
    buyItNowPrice: 12500,
    currency: "USD",
    thumbnailUrl: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0001/thumb-a.jpg",
    imageReference: "https://inventoryv2.copart.io/v1/lotImages/90000001?country=us&brand=cprt&yardNumber=1",
    sellerName: "Example Insurance",
    lastUpdated: "2026-09-20T12:00:00.000Z",
    sourceUrl: "https://www.copart.com/lot/90000001",
    ...overrides,
  };
}

describe("Copart lot lookup input", () => {
  it("resolves an exact lot number", () => {
    expect(resolveCopartLotLookupInput("90000001").lot).toBe("90000001");
    expect(resolveCopartLotLookupInput("  90-000-001 ").lot).toBe("90000001");
    expect(resolveCopartLotLookupInput("12").kind).toBe("invalid");
    expect(resolveCopartLotLookupInput("abc").kind).toBe("invalid");
  });

  it("extracts a Copart URL lot for cache lookup", () => {
    const resolved = resolveCopartLotLookupInput("https://www.copart.com/lot/90000001");
    expect(resolved.kind).toBe("url");
    expect(resolved.lot).toBe("90000001");
    expect(resolved.sourceUrl).toMatch(/copart\.com\/lot\/90000001/);
  });

  it("does not treat an IAA URL as a Copart cache lookup", () => {
    expect(resolveCopartLotLookupInput("https://www.iaai.com/VehicleDetail/5555555").kind).toBe("not_copart");
  });
});

describe("Copart active snapshot only", () => {
  it("looks up only the active snapshot and ignores staging, failed, and archived", () => {
    expect(copartLookupAllowsSnapshotStatus("active")).toBe(true);
    expect(copartLookupAllowsSnapshotStatus("staging")).toBe(false);
    expect(copartLookupAllowsSnapshotStatus("failed")).toBe(false);
    expect(copartLookupAllowsSnapshotStatus("archived")).toBe(false);
    const source = readFileSync(new URL("../../../app/actions/copart.ts", import.meta.url), "utf8");
    expect(source).toMatch(/\.from\("copart_feed_snapshots"\)/);
    expect(source).toMatch(/\.eq\("status", "active"\)/);
    expect(source).toMatch(/\.eq\("snapshot_id", meta\.snapshot\.id\)/);
    expect(source).toMatch(/\.eq\("lot_number", lot\)/);
    expect(source).not.toMatch(/status", "staging"/);
  });
});

describe("canonical Copart opportunity mapping", () => {
  it("prefills vehicle fields from the same mapper used by add-to-opportunities", () => {
    const row = vehicle();
    const insert = copartOpportunityInsert(row, { imageUrls: GALLERY });
    const prefill = copartPrefillFromVehicle(row, { imageUrls: GALLERY });
    expect(prefill.insert).toEqual(insert);
    expect(prefill.form).toEqual(copartFormValuesFromInsert(insert));
    expect(prefill.form.vin).toBe("JTMRWRFV0MD123456");
    expect(prefill.form.year).toBe("2023");
    expect(prefill.form.make).toBe("TOYOTA");
    expect(prefill.form.model).toBe("RAV4");
    expect(prefill.form.trim).toBe("XLE");
    expect(prefill.form.mileage).toBe("41200");
    expect(prefill.form.titleStatus).toBe("SC");
    expect(prefill.form.primaryDamage).toBe("FRONT END");
    expect(prefill.form.location).toBe("MIAMI, FL");
    expect(prefill.metadata.bodyStyle).toBe("SUV");
    expect(prefill.metadata.color).toBe("WHITE");
    expect(prefill.metadata.hasKeys).toBe(true);
    expect(prefill.metadata.engine).toBe("2.5L 4");
    expect(prefill.metadata.buyItNowPrice).toBe(12500);
    expect(prefill.metadata.estimatedRetailValue).toBe(22000);
    expect(prefill.metadata.repairCost).toBe(4100);
    expect(prefill.metadata.sellerName).toBe("Example Insurance");
    expect(prefill.metadata.imageUrls).toEqual(expect.arrayContaining(GALLERY));
  });

  it("uses an official thumbnail and never treats the lotImages JSON as an image src", () => {
    const row = vehicle();
    const summary = copartLookupSummary(row, { imageUrls: GALLERY });
    expect(summary.thumbnailUrl).toBe(copartCardImageUrl(row.thumbnailUrl, row.imageReference));
    expect(summary.thumbnailUrl).toMatch(/^https:\/\/cs\.copart\.com\//);
    expect(isCopartImageManifestUrl(row.imageReference)).toBe(true);
    expect(summary.gallery.every((url) => url.startsWith("https://cs.copart.com/"))).toBe(true);
    expect(summary.gallery.join(" ")).not.toMatch(/inventoryv2\.copart\.io/);
  });

  it("keeps Copart money as internal reference and public price as consult", () => {
    const insert = copartOpportunityInsert(vehicle());
    expect(copartPrefillOmitsPublicPrice(insert)).toBe(true);
    const draft = opportunityToVehicleDraft({
      ...insert,
      internal_notes: null,
      provider_lot_id: insert.provider_lot_id,
    });
    expect(draft.data?.price).toBeNull();
    expect(draft.data?.public_price_mode).toBe("contact");
    expect(JSON.stringify(draft.data)).not.toContain("12500");
  });

  it("does not invent values when the cache field is empty", () => {
    const prefill = copartPrefillFromVehicle(
      vehicle({ trim: null, buyItNowPrice: null, thumbnailUrl: null, imageReference: null }),
    );
    expect(prefill.form.trim).toBe("");
    expect(prefill.metadata.buyItNowPrice).toBeNull();
    expect(prefill.metadata.thumbnailUrl).toBeNull();
  });
});

describe("lookup replace confirmation and failures", () => {
  it("prefills the first lookup without confirmation and asks before replacing manual edits", () => {
    const first = copartPrefillFromVehicle(vehicle()).form;
    const second = copartPrefillFromVehicle(vehicle({ lotNumber: "90000002", make: "HONDA", model: "CIVIC" })).form;
    expect(
      shouldConfirmCopartLookupReplace({
        current: first,
        baseline: null,
        lastAppliedLot: null,
        incomingLot: "90000001",
      }),
    ).toBe(false);
    expect(
      shouldConfirmCopartLookupReplace({
        current: first,
        baseline: first,
        lastAppliedLot: "90000001",
        incomingLot: "90000002",
      }),
    ).toBe(false);
    const edited = { ...first, make: "Honda editada" };
    expect(copartFormHasManualEdits(edited, first)).toBe(true);
    expect(
      shouldConfirmCopartLookupReplace({
        current: edited,
        baseline: first,
        lastAppliedLot: "90000001",
        incomingLot: "90000002",
      }),
    ).toBe(true);
    expect(second.make).toBe("HONDA");
  });

  it("keeps not-found copy professional and preserves duplicate messaging", () => {
    expect(COPART_LOT_NOT_FOUND_MESSAGE).toBe("No encontramos este lote en la última actualización de Copart.");
    expect(COPART_DUPLICATE_LOT_MESSAGE).toBe("Este lote ya está en tus oportunidades.");
    expect(COPART_LOT_NOT_FOUND_MESSAGE).not.toMatch(/42P01|NOT_CONFIGURED|snapshot_id/);
  });
});

describe("Copart lookup stays admin-only", () => {
  it("does not expose cache lookup through public catalog code", () => {
    const catalog = readFileSync(new URL("../../public-catalog.ts", import.meta.url), "utf8");
    const action = readFileSync(new URL("../../../app/actions/copart.ts", import.meta.url), "utf8");
    expect(catalog).not.toMatch(/lookupCopartLotAction|copart_inventory_cache/);
    expect(action).toMatch(/export async function lookupCopartLotAction/);
    expect(action).toMatch(/await requireAdmin\(\);/);
  });
});
