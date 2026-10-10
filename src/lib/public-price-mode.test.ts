import { describe, expect, it } from "vitest";
import { copartOpportunityInsert } from "@/lib/auction-providers/copart/opportunity";
import { opportunityToVehicleDraft } from "@/lib/auctions/prepare-website";
import {
  defaultPublicPriceMode,
  isMissingPublicPriceModeColumn,
  formatCustomerFacingPrice,
  publicPriceAmountOk,
  resolvePublicPriceMode,
  shouldEmitStructuredOfferPrice,
  vehicleSelectWithoutPublicPriceMode,
} from "@/lib/public-price-mode";
import { vehiclePublicationChecks, canPublishVehicleListing } from "@/lib/publication-readiness";
import { vehicleJsonLd } from "@/lib/seo";
import { sortVehicles } from "@/lib/vehicles/filters";
import { toPublicVehicle } from "@/lib/vehicles/normalizeVehicle";
import { displayVehiclePrice } from "@/lib/vehicles/vehicle-formatters";
import type { VehicleRow } from "@/lib/website-schema";

function row(overrides: Partial<VehicleRow> = {}): VehicleRow {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    stock_number: "VM-1",
    vin: "1HGCM82633A004352",
    year: 2021,
    make: "Honda",
    model: "Civic",
    trim: "EX",
    mileage: 24000,
    mileage_unit: "mi",
    exterior_color: "Black",
    interior_color: "Gray",
    engine: "2.0",
    transmission: "CVT",
    drivetrain: "FWD",
    fuel: "Gasoline",
    condition: "Used",
    title_status: "Clean",
    description: "Unidad lista para entrega en Santo Domingo Este.",
    price: 18500,
    currency: "USD",
    location: "Santo Domingo Este",
    source_type: "valcron_stock",
    status: "available",
    featured: false,
    published: true,
    published_at: "2026-09-01T00:00:00.000Z",
    created_at: "2026-08-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    vehicle_photos: [
      {
        id: "p1",
        vehicle_id: "11111111-1111-4111-8111-111111111111",
        storage_path: "11111111-1111-4111-8111-111111111111/a.webp",
        sort_order: 0,
        is_cover: true,
        alt_text: "Portada",
        created_at: "2026-08-01T00:00:00.000Z",
      },
    ],
    ...overrides,
  };
}

function publishBase(overrides: Partial<Parameters<typeof vehiclePublicationChecks>[0]> = {}) {
  return vehiclePublicationChecks({
    year: 2021,
    make: "Honda",
    model: "Civic",
    status: "available",
    description: "Unidad lista para entrega en Santo Domingo Este.",
    photos: row().vehicle_photos,
    ...overrides,
  });
}

describe("auction public pricing", () => {
  it("requires a numeric price for Valcron stock", () => {
    expect(canPublishVehicleListing(publishBase({ source_type: "valcron_stock", public_price_mode: "fixed", price: 0 }))).toBe(
      false,
    );
    expect(
      canPublishVehicleListing(publishBase({ source_type: "valcron_stock", public_price_mode: "fixed", price: 18900 })),
    ).toBe(true);
  });

  it("publishes auction contact mode without a numeric price", () => {
    expect(
      canPublishVehicleListing(publishBase({ source_type: "other", public_price_mode: "contact", price: null })),
    ).toBe(true);
    expect(publicPriceAmountOk("other", "contact", null)).toBe(true);
  });

  it("requires an amount for auction from, estimated, and fixed modes", () => {
    expect(publicPriceAmountOk("other", "from", null)).toBe(false);
    expect(publicPriceAmountOk("other", "estimated", 0)).toBe(false);
    expect(publicPriceAmountOk("other", "fixed", 21500)).toBe(true);
    expect(canPublishVehicleListing(publishBase({ source_type: "other", public_price_mode: "from", price: 0 }))).toBe(false);
    expect(canPublishVehicleListing(publishBase({ source_type: "other", public_price_mode: "from", price: 18900 }))).toBe(true);
    expect(canPublishVehicleListing(publishBase({ source_type: "other", public_price_mode: "estimated", price: 21500 }))).toBe(
      true,
    );
    expect(canPublishVehicleListing(publishBase({ source_type: "other", public_price_mode: "fixed", price: 24900 }))).toBe(true);
  });

  it("does not copy Copart provider amounts into the public Valcron price", () => {
    const insert = copartOpportunityInsert({
      provider: "copart",
      lotNumber: "90000001",
      vin: "JTMRWRFV0MD123456",
      year: 2021,
      make: "TOYOTA",
      model: "RAV4",
      trim: "XLE",
      modelDetail: "RAV4",
      bodyStyle: null,
      color: "WHITE",
      mileage: 41200,
      mileageUnit: "mi",
      titleType: "SC",
      titleState: "FL",
      primaryDamage: "FRONT END",
      secondaryDamage: null,
      hasKeys: true,
      engine: "2.5L 4",
      drive: "AWD",
      transmission: "AUTOMATIC",
      fuel: "GAS",
      cylinders: "4",
      runCondition: "Run & Drive Verified",
      location: "MIAMI, FL",
      locationCity: "MIAMI",
      locationState: "FL",
      saleDate: null,
      saleTime: null,
      saleStatus: null,
      estimatedRetailValue: 22000,
      repairCost: 4100,
      buyItNowPrice: 12500,
      currency: "USD",
      thumbnailUrl: "https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0919/abc_thb.jpg",
      imageReference: "https://inventoryv2.copart.io/v1/lotImages/90000001",
      sourceUrl: "https://www.copart.com/lot/90000001",
      sellerName: "Example Insurance",
      lastUpdated: null,
    });
    const draft = opportunityToVehicleDraft({
      ...insert,
      internal_notes: null,
    });
    expect(draft.data?.public_price_mode).toBe("contact");
    expect(draft.data?.price).toBeNull();
    expect(JSON.stringify(draft.data)).not.toContain("12500");
    expect(JSON.stringify(draft.data)).not.toContain("22000");
    expect(JSON.stringify(draft.data)).not.toContain("4100");
    expect(insert.auction_metadata.buyItNowPrice).toBe(12500);
    expect(insert.auction_metadata.thumbnailUrl).toMatch(/cs\.copart\.com/);
  });

  it("renders customer-facing price copy without zeros or enum values", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const contact = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: 12500 }));
    const from = toPublicVehicle(row({ source_type: "other", public_price_mode: "from", price: 18900 }));
    const estimated = toPublicVehicle(row({ source_type: "other", public_price_mode: "estimated", price: 21500 }));
    const fixed = toPublicVehicle(row({ source_type: "other", public_price_mode: "fixed", price: 24900 }));
    expect(displayVehiclePrice(contact, "USD").primary).toBe("Precio a consultar");
    expect(displayVehiclePrice(from, "USD").primary).toBe("Desde US$ 18,900");
    expect(displayVehiclePrice(estimated, "USD").primary).toBe("Precio estimado US$ 21,500");
    expect(displayVehiclePrice(fixed, "USD").primary).toBe("US$ 24,900");
    expect(displayVehiclePrice(contact, "USD").primary).not.toMatch(/0/);
    expect(JSON.stringify(contact)).not.toContain("buyItNowPrice");
    expect(contact.pricing.usdPrice).toBeNull();
    expect(contact.precioVentaUsd).toBe(0);
    expect(formatCustomerFacingPrice("contact", 0, "USD")).toBe("Precio a consultar");
  });

  it("omits a fake JSON-LD price for contact and non-fixed auction modes", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const contact = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: null }));
    const from = toPublicVehicle(row({ source_type: "other", public_price_mode: "from", price: 18900 }));
    const stock = toPublicVehicle(row({ public_price_mode: "fixed", price: 18500 }));
    expect(vehicleJsonLd(contact).offers).toBeUndefined();
    expect(vehicleJsonLd(from).offers).toBeUndefined();
    expect(shouldEmitStructuredOfferPrice("contact")).toBe(false);
    expect(shouldEmitStructuredOfferPrice("from")).toBe(false);
    expect(shouldEmitStructuredOfferPrice("estimated")).toBe(false);
    expect(vehicleJsonLd(stock).offers).toMatchObject({ price: 18500, priceCurrency: "USD" });
  });

  it("sorts contact-price vehicles after numeric prices", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const cheap = toPublicVehicle(row({ id: "a", price: 10000, public_price_mode: "fixed" }));
    const contact = toPublicVehicle(row({ id: "b", source_type: "other", public_price_mode: "contact", price: 1 }));
    const high = toPublicVehicle(row({ id: "c", price: 40000, public_price_mode: "fixed" }));
    const sorted = sortVehicles([contact, high, cheap], "price_asc");
    expect(sorted.map((item) => item.id)).toEqual(["a", "c", "b"]);
  });

  it("defaults auction origin to contact and keeps IAA/Manheim on the same model", () => {
    expect(defaultPublicPriceMode("other")).toBe("contact");
    expect(defaultPublicPriceMode("valcron_stock")).toBe("fixed");
    expect(resolvePublicPriceMode("other", undefined)).toBe("contact");
    expect(resolvePublicPriceMode("other", "from")).toBe("from");
    expect(resolvePublicPriceMode("valcron_stock", "contact")).toBe("fixed");
  });

  it("detects a missing public_price_mode column without breaking current reads", () => {
    expect(
      isMissingPublicPriceModeColumn({ message: "column vehicles.public_price_mode does not exist" }),
    ).toBe(true);
    expect(
      vehicleSelectWithoutPublicPriceMode(
        "id, price, currency, public_price_mode, location, source_type",
      ),
    ).toBe("id, price, currency, location, source_type");
  });
});
