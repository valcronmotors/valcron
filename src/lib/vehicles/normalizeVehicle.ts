import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";
import { buildVehicleSlug } from "@/lib/vehicles/vehicle-slugs";
import {
  listingKindFromAvailability,
  normalizeAuctionPlatform,
  vehicleAvailabilityFromRow,
  vehicleSourceFromRow,
} from "@/lib/vehicles/vehicle-status";
import type { PublicVehicle, PublicVehicleRow, VehicleImage } from "@/types/vehicle";

function cleanText(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed || null;
}

function normalizeImages(urls: string[] | null | undefined, title: string): VehicleImage[] {
  return (urls ?? [])
    .filter((url) => /^https?:\/\//i.test(url) || url.startsWith("/"))
    .map((url, index) => ({
      url,
      thumbnailUrl: url,
      alt: index === 0 ? `${title} — vista principal` : `${title} — imagen ${index + 1}`,
      order: index,
      category: "other" as const,
    }));
}

export function normalizeVehicle(row: PublicVehicleRow): PublicVehicle {
  const make = cleanText(row.marca) ?? "";
  const model = cleanText(row.modelo) ?? "";
  const year = Number(row.ano) || 0;
  const trim = cleanText(row.trim) || cleanText(row.trim_version);
  const vin = cleanText(row.vin)?.toUpperCase() ?? "";
  const title = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`.replace(/\s+/g, " ").trim();
  const availability = vehicleAvailabilityFromRow(row);
  const source = vehicleSourceFromRow(row);
  const platform = normalizeAuctionPlatform(row.fuente_subasta);
  const tasaUsdDop = Number(row.tasa_usd_dop ?? 0) > 0 ? Number(row.tasa_usd_dop) : DEFAULT_TASA_USD_DOP;
  const rdPrice = Number(row.precio_venta_dop ?? 0);
  const usdPrice = rdPrice > 0 ? Math.round((rdPrice / tasaUsdDop) * 100) / 100 : 0;
  const priceVisible = rdPrice > 0;
  const images = normalizeImages(row.fotos_urls, title);
  const lotNumber = cleanText(row.lote_numero);
  const listingKind = listingKindFromAvailability(availability);
  const location =
    availability === "auction"
      ? [platform ? `Subasta ${platform === "iaai" ? "IAA" : platform}` : "Subasta USA", cleanText(row.ubicacion_lote)]
          .filter(Boolean)
          .join(" · ")
      : availability === "in_transit"
        ? "En tránsito hacia República Dominicana"
        : "Brisa Oriental, Santo Domingo Este, Rep. Dom.";

  const auction =
    availability === "auction" || lotNumber || platform
      ? {
          platform: platform ?? undefined,
          lotNumber,
          sourceUrl: null,
          currentBid: null,
          buyNowPrice: null,
          lastSyncedAt: null,
        }
      : null;

  return {
    id: row.id,
    slug: buildVehicleSlug({ id: row.id, year, make, model, trim }),
    source,
    sourceVehicleId: lotNumber,
    sourceUrl: null,
    year,
    make,
    model,
    trim,
    vin: vin || null,
    stockNumber: null,
    bodyType: null,
    mileage: null,
    mileageUnit: "km",
    engine: null,
    cylinders: null,
    fuelType: null,
    transmission: null,
    drivetrain: null,
    exteriorColor: null,
    interiorColor: null,
    titleType: null,
    condition: null,
    primaryDamage: null,
    secondaryDamage: null,
    keysAvailable: null,
    runAndDrive: null,
    location,
    availability,
    images,
    pricing: {
      currency: "DOP",
      publicPrice: rdPrice > 0 ? rdPrice : null,
      rdPrice: rdPrice > 0 ? rdPrice : null,
      usdPrice: usdPrice > 0 ? usdPrice : null,
      currentBid: null,
      buyNowPrice: null,
      estimatedPrice: null,
      priceVisible,
      priceLabel: priceVisible ? "Precio de venta" : "Consultar precio",
      kind: priceVisible ? "sale" : "consult",
      exchangeRate: tasaUsdDop,
    },
    auction,
    description: null,
    features: [],
    published: true,
    featured: false,
    publishedAt: row.updated_at ?? row.created_at ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
    lastSyncedAt: null,
    marca: make,
    modelo: model,
    ano: year,
    fotosUrls: images.map((image) => image.url),
    estado: row.estado || "Disponible",
    fuenteSubasta: cleanText(row.fuente_subasta),
    ubicacion: location,
    listingKind,
    precioVentaDop: rdPrice,
    precioVentaUsd: usdPrice,
    tasaUsdDop,
    especificaciones: {
      marca: make,
      modelo: model,
      ano: year,
      version: trim,
      vin,
    },
  };
}

export const PUBLIC_VEHICLE_SELECT =
  "id, vin, marca, modelo, trim, trim_version, ano, precio_venta_dop, tasa_usd_dop, fotos_urls, estado, fuente_subasta, ubicacion_lote, lote_numero";
