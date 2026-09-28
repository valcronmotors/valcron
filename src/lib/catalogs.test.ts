import { describe, expect, it } from "vitest";
import {
  filterAuctionCatalogVehicles,
  filterLocalStockVehicles,
  isAuctionCatalogSource,
  isLocalStockSource,
} from "@/lib/catalogs";
import { toPublicVehicle } from "@/lib/vehicles/normalizeVehicle";
import type { VehicleRow } from "@/lib/website-schema";

function row(overrides: Partial<VehicleRow> = {}): VehicleRow {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    stock_number: "VM-1",
    vin: null,
    year: 2023,
    make: "Toyota",
    model: "RAV4",
    trim: null,
    mileage: 10000,
    mileage_unit: "mi",
    exterior_color: null,
    interior_color: null,
    engine: null,
    transmission: null,
    drivetrain: null,
    fuel: null,
    condition: null,
    title_status: null,
    description: "Unidad lista.",
    price: 25000,
    currency: "USD",
    location: "Santo Domingo Este",
    source_type: "valcron_stock",
    status: "available",
    featured: false,
    published: true,
    published_at: "2026-09-01T00:00:00.000Z",
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    public_price_mode: "fixed",
    vehicle_photos: [],
    ...overrides,
  } as VehicleRow;
}

describe("dual catalog boundaries", () => {
  it("classifies local vs auction sources without new schema fields", () => {
    expect(isLocalStockSource("valcron_stock")).toBe(true);
    expect(isLocalStockSource("consignment")).toBe(true);
    expect(isLocalStockSource("trade_in")).toBe(true);
    expect(isLocalStockSource("other")).toBe(false);
    expect(isAuctionCatalogSource("other")).toBe(true);
    expect(isAuctionCatalogSource("valcron_stock")).toBe(false);
  });

  it("keeps auction volume from displacing local inventory", () => {
    const local = toPublicVehicle(row({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", make: "Honda" }));
    const auctions = Array.from({ length: 20 }, (_, index) =>
      toPublicVehicle(
        row({
          id: `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb${String(index).padStart(2, "0")}`,
          source_type: "other",
          public_price_mode: "contact",
          price: null,
          make: "Kia",
        }),
      ),
    );
    const pool = [...auctions, local];
    expect(filterLocalStockVehicles(pool)).toHaveLength(1);
    expect(filterLocalStockVehicles(pool)[0]?.make).toBe("Honda");
    expect(filterAuctionCatalogVehicles(pool)).toHaveLength(20);
    expect(filterAuctionCatalogVehicles(pool).every((item) => item.listingKind === "auction")).toBe(true);
  });
});
