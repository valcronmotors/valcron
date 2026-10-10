import { describe, expect, it } from "vitest";
import { PUBLIC_INVENTORY_EMPTY, PUBLIC_INVENTORY_FILTER_EMPTY } from "@/lib/admin-copy";
import { HOME_FAQS } from "@/lib/home-content";
import {
  catalogQueryString,
  filterCatalogVehicles,
} from "@/lib/public-filters";
import {
  AUCTION_QUOTE_PREFILL,
  AUCTION_SERVICE_COPY,
  formatCustomerFacingPrice,
} from "@/lib/public-price-mode";
import { vehicleJsonLd } from "@/lib/seo";
import { MEGA_NAV, PUBLIC_NAV, PUBLIC_NAV_PRIMARY, RESOURCE_NAV, MOBILE_NAV, SITE } from "@/lib/site";
import { toPublicVehicle } from "@/lib/vehicles/normalizeVehicle";
import { buildVehicleWhatsAppMessage, displayVehiclePrice, visibleVehicleSpecs } from "@/lib/vehicles/vehicle-formatters";
import {
  availabilityLabel,
  publicListingBadge,
  publicVehicleCardActionLabel,
  publicVehicleInquiryLabel,
} from "@/lib/vehicles/vehicle-status";
import type { VehicleRow } from "@/lib/website-schema";

function row(overrides: Partial<VehicleRow> = {}): VehicleRow {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    stock_number: "VM-1",
    vin: "1HGCM82633A004352",
    year: 2023,
    make: "Toyota",
    model: "RAV4",
    trim: "XLE AWD",
    mileage: 25000,
    mileage_unit: "mi",
    exterior_color: "White",
    interior_color: "Black",
    engine: "2.5",
    transmission: "Automática",
    drivetrain: "AWD",
    fuel: "Gasolina",
    condition: "Used",
    title_status: "Clean",
    description: "Unidad lista para entrega en Santo Domingo Este.",
    price: 28500,
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

describe("public website v2 navigation", () => {
  it("keeps the public header order and resources dropdown", () => {
    expect(PUBLIC_NAV_PRIMARY.map((item) => item.label)).toEqual([
      "Inicio",
      "Inventario",
      "Comprar",
      "Financiamiento",
      "Subastas",
      "Servicios",
      "Nosotros",
    ]);
    expect(PUBLIC_NAV.map((item) => item.label)).toEqual([
      "Inicio",
      "Inventario",
      "Comprar",
      "Financiamiento",
      "Subastas",
      "Servicios",
      "Nosotros",
      "Contacto",
    ]);
    expect(RESOURCE_NAV.map((item) => item.label)).toEqual([
      "Blog",
      "Guías",
      "Calculadoras",
      "Preguntas frecuentes",
    ]);
    expect(MOBILE_NAV.map((item) => item.label)).toEqual([
      "Inicio",
      "Inventario",
      "Comprar",
      "Financiamiento",
      "Subastas",
      "Servicios",
      "Nosotros",
      "Blog",
      "Guías",
      "Calculadoras",
      "Preguntas frecuentes",
      "Contacto",
    ]);
    const labels: string[] = PUBLIC_NAV.map((item) => item.label);
    expect(labels).not.toContain("Importación");
    expect(MEGA_NAV.map((item) => item.label)).toEqual([
      "Vehículos",
      "Comprar",
      "Servicios",
      "Recursos",
    ]);
    expect(
      MEGA_NAV.flatMap((item) => item.columns.flatMap((column) => column.links.map((link) => link.href))),
    ).not.toContain("#");

    const vehiculos = MEGA_NAV.find((item) => item.id === "vehiculos");
    expect(vehiculos?.columns.flatMap((c) => c.links.map((l) => l.label))).toEqual([
      "Inventario Valcron",
      "Oportunidades de Subasta",
    ]);

    const comprar = MEGA_NAV.find((item) => item.id === "comprar");
    expect(comprar?.columns.flatMap((c) => c.links.map((l) => l.label))).toEqual([
      "Solicitar vehículo",
      "Financiamiento",
      "Cómo comprar",
      "Cotizaciones",
      "Entrega como parte de pago",
    ]);
  });

  it("keeps the verified Santo Domingo Este address", () => {
    expect(SITE.address.full).toContain("Av Principal 20");
    expect(SITE.address.full).not.toMatch(/Brisa Oriental/i);
  });

  it("publishes WhatsApp as the only public phone number", () => {
    expect(SITE.whatsappDisplay).toBe("(829) 321-1271");
    expect(SITE.whatsappUrl).toBe("https://wa.me/18293211271");
    expect(SITE.whatsappInternational).toBe("+18293211271");
    expect(JSON.stringify(SITE)).not.toMatch(/809.?623.?9381|18096239381/);
    for (const faq of HOME_FAQS) {
      expect(`${faq.q} ${faq.a}`).not.toMatch(/809.?623.?9381/);
    }
  });
});

describe("public price-mode rendering", () => {
  it("never prints 0, null, undefined or NaN", () => {
    expect(formatCustomerFacingPrice("contact", null)).toBe("Consultar precio");
    expect(formatCustomerFacingPrice("contact", 0)).toBe("Consultar precio");
    expect(formatCustomerFacingPrice("from", 18900)).toBe("Desde US$ 18,900");
    expect(formatCustomerFacingPrice("estimated", 21500)).toBe("Precio estimado US$ 21,500");
    expect(formatCustomerFacingPrice("fixed", 28500)).toBe("US$ 28,500");
    expect(formatCustomerFacingPrice("fixed", Number.NaN)).toBe("Consultar precio");
    expect(formatCustomerFacingPrice("from", undefined)).toBe("Consultar precio");

    const contact = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: null }));
    expect(displayVehiclePrice(contact, "USD").primary).toBe("Consultar precio");
    expect(displayVehiclePrice(contact, "USD").primary).not.toMatch(/0|null|undefined|NaN/i);
  });

  it("does not emit a fake Offer price for contact, from or estimated modes", () => {
    const contact = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: null }));
    const from = toPublicVehicle(row({ source_type: "other", public_price_mode: "from", price: 18900 }));
    const estimated = toPublicVehicle(row({ source_type: "other", public_price_mode: "estimated", price: 21500 }));
    const stock = toPublicVehicle(row({ public_price_mode: "fixed", price: 28500 }));
    expect(vehicleJsonLd(contact).offers).toBeUndefined();
    expect(vehicleJsonLd(from).offers).toBeUndefined();
    expect(vehicleJsonLd(estimated).offers).toBeUndefined();
    expect(vehicleJsonLd(stock).offers).toMatchObject({ price: 28500, priceCurrency: "USD" });
  });
});

describe("auction vs Valcron labels and CTAs", () => {
  it("labels dealer stock and auction-origin vehicles for the public site", () => {
    const stock = toPublicVehicle(row());
    const auction = toPublicVehicle(row({ source_type: "other", status: "available", public_price_mode: "contact", price: null }));
    const reserved = toPublicVehicle(row({ status: "reserved" }));
    expect(publicListingBadge(stock).label).toBe("Disponible en Valcron");
    expect(publicListingBadge(auction).label).toBe("Oportunidad de subasta");
    expect(publicListingBadge(reserved).label).toBe("Reservado");
    expect(availabilityLabel("available_rd")).toBe("Disponible en Valcron");
    expect(availabilityLabel("auction")).toBe("Oportunidad de subasta");
  });

  it("uses different public CTAs for dealer stock and auction vehicles", () => {
    const stock = toPublicVehicle(row());
    const auction = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: null }));
    expect(publicVehicleInquiryLabel(stock)).toBe("Solicitar información");
    expect(publicVehicleInquiryLabel(auction)).toBe("Solicitar cotización");
    expect(publicVehicleCardActionLabel(stock)).toBe("WhatsApp");
    expect(publicVehicleCardActionLabel(auction)).toBe("Cotizar");
    expect(AUCTION_QUOTE_PREFILL).toMatch(/disponible mediante subasta/i);
    expect(AUCTION_SERVICE_COPY).toMatch(/compra, transporte e importación/i);
  });

  it("does not expose internal auction metadata on the public vehicle", () => {
    const auction = toPublicVehicle(
      row({
        source_type: "other",
        public_price_mode: "contact",
        price: null,
        description: "Unidad de subasta publicada para cotización.",
      }),
    );
    const payload = JSON.stringify(auction);
    const specText = visibleVehicleSpecs(auction)
      .map((item) => `${item.label} ${item.value}`)
      .join(" ");
    for (const secret of ["buyItNow", "repairCost", "estimatedRetail", "sellerName", "internalNotes"]) {
      expect(payload).not.toContain(secret);
      expect(specText).not.toContain(secret);
    }
  });
});

describe("inventory empty states and filters", () => {
  it("uses customer-facing empty copy", () => {
    expect(PUBLIC_INVENTORY_EMPTY.title).toMatch(/próximamente nuevas unidades/i);
    expect(PUBLIC_INVENTORY_EMPTY.copy).toMatch(/buscas algo específico/i);
    expect(PUBLIC_INVENTORY_FILTER_EMPTY.title).toBe("No encontramos vehículos con estos filtros.");
  });

  it("filters by make, year, listing and keeps a shareable query string", () => {
    const stock = toPublicVehicle(row({ id: "stock-1", make: "Toyota", model: "RAV4", year: 2023 }));
    const honda = toPublicVehicle(row({ id: "stock-2", make: "Honda", model: "Civic", year: 2021 }));
    const auction = toPublicVehicle(
      row({ id: "auc-1", source_type: "other", make: "Toyota", model: "Camry", year: 2022, public_price_mode: "contact", price: null }),
    );
    const empty = {
      listing: "",
      marca: "",
      modelo: "",
      ano: "",
      precioMin: "",
      precioMax: "",
      search: "",
    };
    expect(filterCatalogVehicles([stock, honda, auction], { ...empty, marca: "Toyota" }).map((item) => item.id)).toEqual([
      "stock-1",
      "auc-1",
    ]);
    expect(filterCatalogVehicles([stock, honda, auction], { ...empty, listing: "dealer" }).every((item) => item.listingKind === "dealer")).toBe(
      true,
    );
    expect(filterCatalogVehicles([stock, honda, auction], { ...empty, listing: "auction" }).map((item) => item.id)).toEqual(["auc-1"]);
    expect(filterCatalogVehicles([stock, honda, auction], { ...empty, ano: "2021" }).map((item) => item.id)).toEqual(["stock-2"]);
    expect(catalogQueryString({ ...empty, marca: "Toyota", ano: "2023" })).toBe("marca=Toyota&ano=2023");
  });
});

describe("public copy constraints", () => {
  it("does not present Manheim as an active public integration", () => {
    expect(HOME_FAQS.some((item) => /Manheim/i.test(item.a))).toBe(false);
    expect(SITE.heroTitle).toMatch(/Más opciones/i);
    expect(SITE.heroTitle).toMatch(/Más cerca/i);
  });

  it("uses Dominican WhatsApp copy with vehicle context", () => {
    const stock = toPublicVehicle(row());
    const auction = toPublicVehicle(row({ source_type: "other", public_price_mode: "contact", price: null }));
    expect(buildVehicleWhatsAppMessage(stock)).toMatch(/^Hola, me interesa este vehículo disponible en Valcron: 2023 Toyota RAV4/);
    expect(buildVehicleWhatsAppMessage(stock)).toContain("https://valcronmotors.com/inventario/");
    expect(buildVehicleWhatsAppMessage(auction)).toMatch(/cotización para esta oportunidad de subasta/);
  });
});
