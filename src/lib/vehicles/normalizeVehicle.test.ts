import { describe, expect, it } from "vitest";
import { toPublicVehicle } from "@/lib/vehicles/normalizeVehicle";
import { visibleVehicleSpecs } from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge } from "@/lib/vehicles/vehicle-status";
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
    description: "Unidad lista para entrega en RD.",
    price: 18500,
    currency: "USD",
    location: "Santo Domingo Este",
    source_type: "valcron_stock",
    status: "available",
    featured: true,
    published: true,
    published_at: "2026-09-01T00:00:00.000Z",
    created_at: "2026-08-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    vehicle_photos: [
      {
        id: "p2",
        vehicle_id: "11111111-1111-4111-8111-111111111111",
        storage_path: "11111111-1111-4111-8111-111111111111/b.webp",
        sort_order: 1,
        is_cover: false,
        alt_text: "Lateral",
        created_at: "2026-08-02T00:00:00.000Z",
      },
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

describe("vehicle normalization", () => {
  it("maps website fields into PublicVehicle without internal notes", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const vehicle = toPublicVehicle(row());
    expect(vehicle.make).toBe("Honda");
    expect(vehicle.marca).toBe("Honda");
    expect(vehicle.model).toBe("Civic");
    expect(vehicle.year).toBe(2021);
    expect(vehicle.mileage).toBe(24000);
    expect(vehicle.description).toBe("Unidad lista para entrega en RD.");
    expect(vehicle.featured).toBe(true);
    expect(vehicle.published).toBe(true);
    expect(vehicle.images[0]?.alt).toBe("Portada");
    expect(vehicle.pricing.usdPrice).toBe(18500);
    expect(vehicle).not.toHaveProperty("internal_notes");
    expect(JSON.stringify(vehicle)).not.toContain("internal_notes");
  });

  it("uses real cover photo first", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const vehicle = toPublicVehicle(row());
    expect(vehicle.images[0]?.id).toBe("p1");
    expect(vehicle.fotosUrls[0]).toContain("vehicle-images");
  });

  it("labels auction-origin units without claiming Valcron stock", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const vehicle = toPublicVehicle(row({ source_type: "other" }));
    expect(vehicle.listingKind).toBe("auction");
    expect(vehicle.availability).toBe("auction");
    expect(vehicle.source).toBe("manual");
    expect(publicListingBadge(vehicle).label).toBe("Disponible mediante subasta");
    expect(publicListingBadge(toPublicVehicle(row())).label).toBe("Disponible en Valcron");
  });

  it("does not present title or a vehicle-specific address as public specs", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const labels = visibleVehicleSpecs(toPublicVehicle(row())).map((item) => item.label);
    expect(labels).not.toContain("Ubicación");
    expect(labels).not.toContain("Tipo de título");
  });
});
