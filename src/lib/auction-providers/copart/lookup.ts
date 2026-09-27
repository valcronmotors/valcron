import { parseAuctionSourceUrl } from "@/lib/auctions/url";
import {
  formatAuctionDisplayName,
  opportunityVehicleTitle,
} from "@/lib/auctions/opportunity-admin";
import { copartCardImageUrl, normalizeCopartFeedImages } from "./images";
import { copartOpportunityInsert, type CopartOpportunityMetadata } from "./opportunity";
import type { AuctionSearchVehicle } from "../types";
import { copartLotSourceUrl, normalizeCopartLotNumber } from "./urls";

export const COPART_LOT_NOT_FOUND_MESSAGE =
  "No encontramos este lote en la última actualización de Copart.";
export const COPART_LOT_NOT_FOUND_HINT =
  "El lote puede ser nuevo, haber sido retirado o no estar incluido en la última actualización.";
export const COPART_LOOKUP_INVALID_LOT = "Ingresa un número de lote Copart válido.";
export const COPART_LOOKUP_SUCCESS_MESSAGE = "Vehículo encontrado";
export const COPART_LOOKUP_LOADED_COPY = "Datos cargados desde el inventario oficial de Copart.";
export const COPART_ACTIVE_SNAPSHOT_STATUS = "active" as const;

export type CopartLookupSnapshotStatus = "staging" | "active" | "failed" | "archived";

export type CopartOpportunityFormValues = {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  titleStatus: string;
  primaryDamage: string;
  location: string;
};

export function copartLookupAllowsSnapshotStatus(status: string | null | undefined) {
  return status === COPART_ACTIVE_SNAPSHOT_STATUS;
}

export function resolveCopartLotLookupInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { lot: null as string | null, sourceUrl: null as string | null, kind: "invalid" as const };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = parseAuctionSourceUrl(trimmed);
    if (parsed.data?.provider === "copart") {
      const lot = normalizeCopartLotNumber(parsed.data.providerLotId);
      return {
        lot,
        sourceUrl: parsed.data.sourceUrl,
        kind: lot ? ("url" as const) : ("invalid" as const),
      };
    }
    return { lot: null, sourceUrl: parsed.data?.sourceUrl ?? null, kind: "not_copart" as const };
  }

  const lot = normalizeCopartLotNumber(trimmed);
  return {
    lot,
    sourceUrl: lot ? copartLotSourceUrl(lot) : null,
    kind: lot ? ("lot" as const) : ("invalid" as const),
  };
}

export function copartFormValuesFromInsert(insert: ReturnType<typeof copartOpportunityInsert>): CopartOpportunityFormValues {
  return {
    vin: insert.vin ?? "",
    year: insert.year != null ? String(insert.year) : "",
    make: insert.make ?? "",
    model: insert.model ?? "",
    trim: insert.trim ?? "",
    mileage: insert.mileage != null ? String(insert.mileage) : "",
    titleStatus: insert.title_status ?? "",
    primaryDamage: insert.primary_damage ?? "",
    location: insert.location ?? "",
  };
}

export function copartPrefillFromVehicle(vehicle: AuctionSearchVehicle, extra?: { imageUrls?: string[] }) {
  const insert = copartOpportunityInsert(vehicle, extra);
  return {
    insert,
    form: copartFormValuesFromInsert(insert),
    lot: insert.provider_lot_id,
    sourceUrl: insert.source_url ?? "",
    metadata: insert.auction_metadata as CopartOpportunityMetadata,
  };
}

export function copartFormHasManualEdits(
  current: CopartOpportunityFormValues,
  baseline: CopartOpportunityFormValues | null,
) {
  if (!baseline) return false;
  return (Object.keys(current) as (keyof CopartOpportunityFormValues)[]).some(
    (key) => current[key].trim() !== baseline[key].trim(),
  );
}

export function shouldConfirmCopartLookupReplace(input: {
  current: CopartOpportunityFormValues;
  baseline: CopartOpportunityFormValues | null;
  lastAppliedLot: string | null;
  incomingLot: string;
}) {
  if (!input.lastAppliedLot || input.lastAppliedLot === input.incomingLot) return false;
  return copartFormHasManualEdits(input.current, input.baseline);
}

export function emptyCopartFormValues(): CopartOpportunityFormValues {
  return {
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    titleStatus: "",
    primaryDamage: "",
    location: "",
  };
}

export function copartLookupSummary(
  vehicle: AuctionSearchVehicle,
  extra?: { imageUrls?: string[]; lastUpdated?: string | null },
) {
  const insert = copartOpportunityInsert(vehicle, extra);
  const meta = insert.auction_metadata;
  const images = normalizeCopartFeedImages({
    thumbnail: vehicle.thumbnailUrl,
    imageUrl: vehicle.imageReference,
    extraUrls: extra?.imageUrls,
  });
  const thumbnail = copartCardImageUrl(images.thumbnailUrl, vehicle.thumbnailUrl);
  const title = opportunityVehicleTitle({
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
  });
  const trim = formatAuctionDisplayName(vehicle.trim);
  const modelDetail = formatAuctionDisplayName(vehicle.modelDetail);
  return {
    title: trim ? `${title} ${trim}` : title,
    modelDetail,
    lot: vehicle.lotNumber,
    vin: vehicle.vin,
    mileage: vehicle.mileage,
    runCondition: vehicle.runCondition,
    damage: vehicle.primaryDamage,
    location: vehicle.location,
    saleDate: vehicle.saleDate,
    saleTime: vehicle.saleTime,
    buyItNowPrice: meta.buyItNowPrice,
    estimatedRetailValue: meta.estimatedRetailValue,
    repairCost: meta.repairCost,
    currency: meta.currency,
    thumbnailUrl: thumbnail,
    gallery: images.imageUrls,
    lastUpdated: extra?.lastUpdated ?? vehicle.lastUpdated ?? meta.feedLastUpdated,
  };
}

export function copartPrefillOmitsPublicPrice(insert: ReturnType<typeof copartOpportunityInsert>) {
  const record = insert as unknown as Record<string, unknown>;
  return !("price" in record) && !("public_price_mode" in record);
}
