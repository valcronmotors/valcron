import { readAuctionMetadata } from "@/lib/auction-admin-fields";
import type { AuctionOpportunityRow, PublicPriceMode, VehicleSourceType } from "@/lib/website-schema";
import { copartPublicDraftExtras } from "@/lib/auction-providers/copart/opportunity";
import { defaultPublicPriceMode } from "@/lib/public-price-mode";
import { historicalProviderLabel } from "@/lib/auctions/opportunity-admin";

export type VehicleDraftFromOpportunity = {
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  mileage_unit: "mi" | "km";
  exterior_color: string | null;
  interior_color: string | null;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  fuel: string | null;
  title_status: string | null;
  condition: string | null;
  location: string | null;
  source_type: VehicleSourceType;
  public_price_mode: PublicPriceMode;
  status: "draft" | "available";
  published: false;
  featured: boolean;
  description: string | null;
  price: number | null;
  stock_number: string | null;
};

const PUBLIC_VEHICLE_KEYS = [
  "vin",
  "year",
  "make",
  "model",
  "trim",
  "mileage",
  "mileage_unit",
  "exterior_color",
  "interior_color",
  "engine",
  "transmission",
  "drivetrain",
  "fuel",
  "title_status",
  "condition",
  "location",
  "source_type",
  "public_price_mode",
  "status",
  "published",
  "featured",
  "description",
  "price",
  "stock_number",
] as const;

function buildAuctionDescription(
  opportunity: Pick<AuctionOpportunityRow, "primary_damage" | "provider" | "provider_lot_id" | "auction_metadata">,
) {
  const meta = readAuctionMetadata(opportunity.auction_metadata);
  if (meta.description?.trim()) {
    return meta.description.trim();
  }
  const parts: string[] = [];
  const provider = historicalProviderLabel(opportunity.provider);
  if (opportunity.provider_lot_id) {
    parts.push(`Oportunidad de subasta ${provider}, lote ${opportunity.provider_lot_id}.`);
  } else {
    parts.push(`Oportunidad de subasta ${provider}.`);
  }
  const damage = (opportunity.primary_damage ?? "").trim();
  if (damage) {
    parts.push(`Daño principal reportado: ${damage}.`);
  }
  if (meta.secondary_damage && meta.secondary_damage !== "None" && meta.secondary_damage !== "Not Reported") {
    parts.push(`Daño secundario: ${meta.secondary_damage}.`);
  }
  if (meta.run_and_drive) {
    parts.push(`Run and Drive: ${meta.run_and_drive}.`);
  }
  parts.push("No implica disponibilidad física en Valcron Motors.");
  return parts.join(" ");
}

export function opportunityToVehicleDraft(
  opportunity: Pick<
    AuctionOpportunityRow,
    | "vin"
    | "year"
    | "make"
    | "model"
    | "trim"
    | "mileage"
    | "title_status"
    | "location"
    | "primary_damage"
    | "internal_notes"
    | "provider"
    | "provider_lot_id"
    | "auction_metadata"
  >,
): { data: VehicleDraftFromOpportunity | null; error: string | null } {
  const year = Number(opportunity.year);
  const make = (opportunity.make ?? "").trim();
  const model = (opportunity.model ?? "").trim();

  if (!Number.isFinite(year) || year < 1980 || !make || !model) {
    return {
      data: null,
      error: "Completa año, marca y modelo antes de preparar la unidad para el website.",
    };
  }

  const meta = readAuctionMetadata(opportunity.auction_metadata);
  const extras = copartPublicDraftExtras(opportunity.auction_metadata);
  const buyNow =
    meta.price_mode === "buy_now" && meta.buy_now_usd != null && meta.buy_now_usd > 0
      ? meta.buy_now_usd
      : null;
  const publicPriceMode: PublicPriceMode = buyNow != null ? "fixed" : defaultPublicPriceMode("other");
  const locationParts = [meta.city, meta.state, opportunity.location].filter(
    (part): part is string => Boolean(part && String(part).trim()),
  );

  return {
    data: {
      vin: opportunity.vin,
      year,
      make,
      model,
      trim: opportunity.trim,
      mileage: opportunity.mileage,
      mileage_unit: meta.mileage_unit === "km" ? "km" : "mi",
      exterior_color: meta.exterior_color ?? extras.exterior_color,
      interior_color: meta.interior_color ?? null,
      engine: meta.engine ?? extras.engine,
      transmission: meta.transmission ?? extras.transmission,
      drivetrain: meta.drivetrain ?? extras.drivetrain,
      fuel: meta.fuel ?? extras.fuel,
      title_status: opportunity.title_status,
      condition: (opportunity.primary_damage ?? "").trim() || null,
      location: locationParts.join(", ") || opportunity.location,
      source_type: "other",
      public_price_mode: publicPriceMode,
      status: "draft",
      published: false,
      featured: Boolean(meta.featured),
      description: buildAuctionDescription(opportunity),
      price: buyNow,
      stock_number: opportunity.provider_lot_id,
    },
    error: null,
  };
}

export function publicVehicleKeysFromDraft(draft: VehicleDraftFromOpportunity) {
  return PUBLIC_VEHICLE_KEYS.reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = draft[key];
    return acc;
  }, {});
}

export function reusableWebsiteVehicleId(opportunity: { linked_vehicle_id: string | null }) {
  return opportunity.linked_vehicle_id;
}

export function draftExposesInternalNotes(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(value, "internal_notes");
}
