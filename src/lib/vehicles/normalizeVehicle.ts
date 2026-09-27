import {
  formatCustomerFacingPrice,
  publicPriceKind,
  resolvePublicPriceMode,
} from "@/lib/public-price-mode";
import { DEFAULT_TASA_USD_DOP } from "@/lib/fx";
import { sortVehiclePhotos, vehicleImageAdminPath, vehicleImagePublicPath } from "@/lib/storage";
import { buildVehicleSlug } from "@/lib/vehicles/vehicle-slugs";
import {
  listingKindFromAvailability,
  vehicleAvailabilityFromRow,
  vehicleSourceFromType,
} from "@/lib/vehicles/vehicle-status";
import type { PublicVehicle, VehicleImage } from "@/types/vehicle";
import type { VehiclePhotoRow, VehicleRow } from "@/lib/website-schema";

function cleanText(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed || null;
}

function numberOrNull(value: number | string | null | undefined) {
  if (value == null || value === "") {
    return null;
  }
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function photosToImages(
  photos: VehiclePhotoRow[] | null | undefined,
  title: string,
): VehicleImage[] {
  return sortVehiclePhotos(photos ?? []).map((photo, index) => {
    const url = vehicleImagePublicPath(photo.storage_path);
    return {
      id: photo.id,
      url,
      thumbnailUrl: url,
      alt: photo.alt_text || (photo.is_cover ? `${title} — vista principal` : `${title} — imagen ${index + 1}`),
      order: photo.sort_order,
      category: "other" as const,
    };
  });
}

export function toPublicVehicle(row: VehicleRow): PublicVehicle {
  const make = cleanText(row.make) ?? "";
  const model = cleanText(row.model) ?? "";
  const year = Number(row.year) || 0;
  const trim = cleanText(row.trim);
  const vin = cleanText(row.vin)?.toUpperCase() ?? "";
  const title = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`.replace(/\s+/g, " ").trim();
  const availability = vehicleAvailabilityFromRow(row);
  const source = vehicleSourceFromType(row.source_type);
  const listingKind = listingKindFromAvailability(availability);
  const images = photosToImages(row.vehicle_photos, title);
  const price = numberOrNull(row.price);
  const currency = row.currency === "DOP" ? "DOP" : "USD";
  const mode = resolvePublicPriceMode(row.source_type, row.public_price_mode);
  const tasaUsdDop = DEFAULT_TASA_USD_DOP;
  const usdPrice =
    price == null
      ? 0
      : currency === "USD"
        ? price
        : Math.round((price / tasaUsdDop) * 100) / 100;
  const rdPrice =
    price == null
      ? 0
      : currency === "DOP"
        ? price
        : Math.round(price * tasaUsdDop * 100) / 100;
  const priceVisible = mode !== "contact" && Boolean(price && price > 0);
  const numericUsd = priceVisible && usdPrice > 0 ? usdPrice : null;
  const numericRd = priceVisible && rdPrice > 0 ? rdPrice : null;
  const location = cleanText(row.location);
  const estado =
    row.status === "sold"
      ? "Vendido"
      : row.status === "reserved"
        ? "Reservado"
        : row.status === "hidden"
          ? "Oculto"
          : row.status === "draft"
            ? "Borrador"
            : "Disponible";

  return {
    id: row.id,
    slug: buildVehicleSlug({ id: row.id, year, make, model, trim }),
    source,
    sourceVehicleId: cleanText(row.stock_number),
    sourceUrl: null,
    year,
    make,
    model,
    trim,
    vin: vin || null,
    stockNumber: cleanText(row.stock_number),
    bodyType: null,
    mileage: numberOrNull(row.mileage),
    mileageUnit: row.mileage_unit === "km" ? "km" : "mi",
    engine: cleanText(row.engine),
    cylinders: null,
    fuelType: cleanText(row.fuel),
    transmission: cleanText(row.transmission),
    drivetrain: cleanText(row.drivetrain),
    exteriorColor: cleanText(row.exterior_color),
    interiorColor: cleanText(row.interior_color),
    titleType: cleanText(row.title_status),
    condition: cleanText(row.condition),
    primaryDamage: null,
    secondaryDamage: null,
    keysAvailable: null,
    runAndDrive: null,
    location,
    availability,
    images,
    pricing: {
      currency,
      publicPrice: priceVisible ? price : null,
      rdPrice: numericRd,
      usdPrice: numericUsd,
      currentBid: null,
      buyNowPrice: null,
      estimatedPrice: mode === "estimated" && priceVisible ? price : null,
      priceVisible,
      priceLabel: formatCustomerFacingPrice(mode, price, currency),
      kind: publicPriceKind(mode),
      publicPriceMode: mode,
      exchangeRate: tasaUsdDop,
    },
    auction: null,
    description: cleanText(row.description),
    features: [],
    published: row.published,
    featured: Boolean(row.featured),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSyncedAt: null,
    marca: make,
    modelo: model,
    ano: year,
    fotosUrls: images.map((image) => image.url),
    estado,
    fuenteSubasta: null,
    ubicacion: location ?? "",
    listingKind,
    precioVentaDop: numericRd ?? 0,
    precioVentaUsd: numericUsd ?? 0,
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

export function normalizeVehicle(row: VehicleRow): PublicVehicle {
  return toPublicVehicle(row);
}

export function toAdminPreviewVehicle(row: VehicleRow): PublicVehicle {
  const vehicle = toPublicVehicle(row);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim();
  const images = sortVehiclePhotos(row.vehicle_photos ?? []).map((photo, index) => {
    const url = vehicleImageAdminPath(photo.storage_path);
    return {
      id: photo.id,
      url,
      thumbnailUrl: url,
      alt: photo.alt_text || (photo.is_cover ? `${title} — vista principal` : `${title} — imagen ${index + 1}`),
      order: photo.sort_order,
      category: "other" as const,
    };
  });
  return {
    ...vehicle,
    images,
    fotosUrls: images.map((image) => image.url),
  };
}

export const PUBLIC_VEHICLE_LIST_SELECT = `
  id, stock_number, vin, year, make, model, trim, mileage, mileage_unit,
  price, currency, public_price_mode, location, source_type, status, featured, published,
  published_at, created_at, updated_at
`.replace(/\s+/g, " ").trim();

export const PUBLIC_VEHICLE_SELECT = `
  ${PUBLIC_VEHICLE_LIST_SELECT},
  exterior_color, interior_color, engine, transmission, drivetrain, fuel,
  condition, title_status, description,
  vehicle_photos ( id, vehicle_id, storage_path, sort_order, is_cover, alt_text, created_at )
`.replace(/\s+/g, " ").trim();

export const PUBLIC_COVER_PHOTO_SELECT =
  "id, vehicle_id, storage_path, sort_order, is_cover, alt_text, created_at";
