import { describe, expect, it } from "vitest";
import { adminGreeting, AUCTION_STATUS_LABEL, PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { ADMIN_TRANSMISSION_OPTIONS, withCurrentOption } from "@/lib/admin-field-options";
import { formatAdminPricePreview } from "@/lib/admin-metrics";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { isUnavailableInventoryError, publicInventoryDisplayError } from "@/lib/public-empty";
import { canPublishVehicleListing, vehiclePublicationChecks } from "@/lib/publication-readiness";
import { safeNextPath } from "@/lib/site";

describe("publication readiness", () => {
  it("requires cover, identity, and a public status", () => {
    const checks = vehiclePublicationChecks({
      year: 2021,
      make: "Honda",
      model: "Civic",
      status: "draft",
      photos: [],
    });
    expect(canPublishVehicleListing(checks)).toBe(false);
    expect(checks.find((item) => item.id === "cover")?.ok).toBe(false);
  });

  it("requires price and description to publish", () => {
    const base = {
      year: 2021,
      make: "Honda",
      model: "Civic",
      status: "available" as const,
      photos: [
        {
          id: "p1",
          vehicle_id: "v1",
          storage_path: "11111111-1111-4111-8111-111111111111/a.webp",
          sort_order: 0,
          is_cover: true,
          alt_text: "Portada",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      ],
    };
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({ ...base, price: 0, description: "Unidad lista para entrega en Santo Domingo Este." }),
      ),
    ).toBe(false);
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({ ...base, price: 18000, description: "Corta" }),
      ),
    ).toBe(false);
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({
          ...base,
          source_type: "other",
          public_price_mode: "contact",
          price: 0,
          description: "Unidad lista para entrega en Santo Domingo Este.",
        }),
      ),
    ).toBe(true);
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({
          ...base,
          source_type: "other",
          public_price_mode: "from",
          price: 0,
          description: "Unidad lista para entrega en Santo Domingo Este.",
        }),
      ),
    ).toBe(false);
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({
          ...base,
          source_type: "other",
          public_price_mode: "estimated",
          price: 0,
          description: "Unidad lista para entrega en Santo Domingo Este.",
        }),
      ),
    ).toBe(false);
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({
          ...base,
          source_type: "other",
          public_price_mode: "fixed",
          price: 0,
          description: "Unidad lista para entrega en Santo Domingo Este.",
        }),
      ),
    ).toBe(false);
    expect(vehiclePublicationChecks({ ...base, price: 18000, description: "Corta" }).find((item) => item.id === "description")?.required).toBe(true);
    expect(vehiclePublicationChecks({ ...base, price: 18000, description: "Corta" }).find((item) => item.id === "cover")?.required).toBe(true);
  });

  it("treats mileage and extra photos as recommended, not blockers", () => {
    const checks = vehiclePublicationChecks({
      year: 2021,
      make: "Honda",
      model: "Civic",
      status: "available",
      price: 18000,
      description: "Unidad lista para entrega en Santo Domingo Este.",
      photos: [
        {
          id: "p1",
          vehicle_id: "v1",
          storage_path: "11111111-1111-4111-8111-111111111111/a.webp",
          sort_order: 0,
          is_cover: true,
          alt_text: "Portada",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
    expect(checks.find((item) => item.id === "mileage")?.required).toBe(false);
    expect(checks.find((item) => item.id === "gallery")?.required).toBe(false);
    expect(canPublishVehicleListing(checks)).toBe(true);
  });

  it("allows publish when required items are complete", () => {
    const checks = vehiclePublicationChecks({
      year: 2021,
      make: "Honda",
      model: "Civic",
      status: "available",
      price: 18000,
      description: "Unidad lista para entrega en Santo Domingo Este.",
      photos: [
        {
          id: "p1",
          vehicle_id: "v1",
          storage_path: "11111111-1111-4111-8111-111111111111/a.webp",
          sort_order: 0,
          is_cover: true,
          alt_text: "Portada",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
    expect(canPublishVehicleListing(checks)).toBe(true);
  });

  it("blocks publish without a cover even when price and description exist", () => {
    expect(
      canPublishVehicleListing(
        vehiclePublicationChecks({
          year: 2021,
          make: "Honda",
          model: "Civic",
          status: "available",
          price: 18000,
          description: "Unidad lista para entrega en Santo Domingo Este.",
          photos: [
            {
              id: "p1",
              vehicle_id: "v1",
              storage_path: "11111111-1111-4111-8111-111111111111/a.webp",
              sort_order: 0,
              is_cover: false,
              alt_text: "Lateral",
              created_at: "2026-01-01T00:00:00.000Z",
            },
          ],
        }),
      ),
    ).toBe(false);
  });
});

describe("public empty inventory", () => {
  it("hides technical load failures from visitors", () => {
    expect(isUnavailableInventoryError("No pudimos cargar el inventario en este momento.")).toBe(true);
    expect(publicInventoryDisplayError("No pudimos cargar el inventario en este momento.")).toBeNull();
    expect(PUBLIC_INVENTORY_EMPTY.title).toMatch(/preparando nuevas unidades/i);
  });
});

describe("legacy isolation", () => {
  it("keeps admin nav on website modules only", () => {
    const hrefs = ADMIN_NAV.map((item) => item.href).join(" ");
    expect(hrefs).not.toContain("/vehiculos");
    expect(hrefs).not.toContain("/repuestos");
    expect(hrefs).not.toContain("/crm");
    expect(ADMIN_NAV.map((item) => item.label)).toEqual([
      "Dashboard",
      "Inventario Valcron",
      "Subastas",
      "Solicitudes",
      "Website",
    ]);
    expect(ADMIN_NAV.find((item) => item.id === "inventario")?.children?.map((c) => c.label)).toEqual([
      "Vehículos",
      "Agregar vehículo",
    ]);
    expect(ADMIN_NAV.find((item) => item.id === "subastas")?.children?.map((c) => c.label)).toEqual([
      "Oportunidades",
      "Buscar en Copart",
      "IAA / Agregar manualmente",
    ]);
  });
});

describe("open redirect guard", () => {
  it("rejects unsafe next paths", () => {
    expect(safeNextPath("https://evil.test")).toBe("/admin");
    expect(safeNextPath("//evil.test")).toBe("/admin");
    expect(safeNextPath("/login")).toBe("/admin");
    expect(safeNextPath("/admin/inventario")).toBe("/admin/inventario");
  });
});

describe("auction copy", () => {
  it("uses dealer-facing status labels", () => {
    expect(AUCTION_STATUS_LABEL.review).toBe("En revisión");
    expect(AUCTION_STATUS_LABEL.draft).toBe("Borrador");
  });
});

describe("admin greeting", () => {
  it("uses the time of day in Spanish", () => {
    expect(adminGreeting(new Date("2026-09-27T08:00:00"))).toBe("Buenos días");
    expect(adminGreeting(new Date("2026-09-27T15:00:00"))).toBe("Buenas tardes");
    expect(adminGreeting(new Date("2026-09-27T21:00:00"))).toBe("Buenas noches");
  });
});

describe("admin field options", () => {
  it("preserves an existing custom value", () => {
    expect(withCurrentOption(ADMIN_TRANSMISSION_OPTIONS, "Tiptronic").some((item) => item.value === "Tiptronic")).toBe(
      true,
    );
    expect(withCurrentOption(ADMIN_TRANSMISSION_OPTIONS, "Automática")).toHaveLength(
      ADMIN_TRANSMISSION_OPTIONS.length,
    );
  });
});

describe("admin price preview", () => {
  it("formats dealer-facing currency prefixes", () => {
    expect(formatAdminPricePreview(29900, "USD")).toBe("US$29,900");
    expect(formatAdminPricePreview(1750000, "DOP")).toBe("RD$1,750,000");
  });
});
