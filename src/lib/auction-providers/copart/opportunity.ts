import type { AuctionSearchVehicle } from "../types";
import { normalizeCopartFeedImages, normalizeCopartManifestUrl } from "./images";

export const COPART_DUPLICATE_LOT_MESSAGE = "Este lote ya está en tus oportunidades.";

export type CopartOpportunityMetadata = {
  bodyStyle: string | null;
  color: string | null;
  secondaryDamage: string | null;
  hasKeys: boolean | null;
  engine: string | null;
  drive: string | null;
  transmission: string | null;
  fuel: string | null;
  cylinders: string | null;
  runCondition: string | null;
  saleStatus: string | null;
  saleDate: string | null;
  saleTime: string | null;
  estimatedRetailValue: number | null;
  repairCost: number | null;
  buyItNowPrice: number | null;
  currency: string | null;
  thumbnailUrl: string | null;
  imageReference: string | null;
  imageUrls: string[];
  sellerName: string | null;
  feedLastUpdated: string | null;
  modelDetail: string | null;
};

const PRIVATE_METADATA_KEYS = [
  "estimatedRetailValue",
  "repairCost",
  "buyItNowPrice",
  "sellerName",
  "imageReference",
  "thumbnailUrl",
  "imageUrls",
  "feedLastUpdated",
] as const;

export function copartOpportunityMetadata(
  vehicle: AuctionSearchVehicle,
  extra?: { imageUrls?: string[] },
): CopartOpportunityMetadata {
  const images = normalizeCopartFeedImages({
    thumbnail: vehicle.thumbnailUrl,
    imageUrl: vehicle.imageReference,
    extraUrls: extra?.imageUrls,
  });
  return {
    bodyStyle: vehicle.bodyStyle,
    color: vehicle.color,
    secondaryDamage: vehicle.secondaryDamage,
    hasKeys: vehicle.hasKeys,
    engine: vehicle.engine,
    drive: vehicle.drive,
    transmission: vehicle.transmission,
    fuel: vehicle.fuel,
    cylinders: vehicle.cylinders,
    runCondition: vehicle.runCondition,
    saleStatus: vehicle.saleStatus,
    saleDate: vehicle.saleDate,
    saleTime: vehicle.saleTime,
    estimatedRetailValue: vehicle.estimatedRetailValue,
    repairCost: vehicle.repairCost,
    buyItNowPrice: vehicle.buyItNowPrice,
    currency: vehicle.currency,
    thumbnailUrl: images.thumbnailUrl,
    imageReference: images.manifestUrl ?? normalizeCopartManifestUrl(vehicle.imageReference),
    imageUrls: images.imageUrls,
    sellerName: vehicle.sellerName,
    feedLastUpdated: vehicle.lastUpdated,
    modelDetail: vehicle.modelDetail,
  };
}

export function copartOpportunityInsert(vehicle: AuctionSearchVehicle, extra?: { imageUrls?: string[] }) {
  return {
    provider: "copart" as const,
    provider_lot_id: vehicle.lotNumber,
    source_url: vehicle.sourceUrl,
    vin: vehicle.vin,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    mileage: vehicle.mileage,
    title_status: vehicle.titleType,
    primary_damage: vehicle.primaryDamage,
    location: vehicle.location,
    auction_metadata: copartOpportunityMetadata(vehicle, extra),
    status: "draft" as const,
  };
}

export function copartPublicDraftExtras(metadata: Record<string, unknown> | null | undefined) {
  const meta = metadata ?? {};
  return {
    exterior_color: stringOrNull(meta.color),
    engine: stringOrNull(meta.engine),
    transmission: stringOrNull(meta.transmission),
    drivetrain: stringOrNull(meta.drive),
    fuel: stringOrNull(meta.fuel),
  };
}

export function copartMetadataLeaksIntoPublicDto(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return PRIVATE_METADATA_KEYS.some((key) => Object.prototype.hasOwnProperty.call(record, key));
}

function stringOrNull(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
