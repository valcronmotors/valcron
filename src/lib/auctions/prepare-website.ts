import type { AuctionOpportunityRow, PublicPriceMode, VehicleSourceType } from "@/lib/website-schema";
import { copartPublicDraftExtras } from "@/lib/auction-providers/copart/opportunity";
import { defaultPublicPriceMode } from "@/lib/public-price-mode";

export type VehicleDraftFromOpportunity = {
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  mileage_unit: "mi";
  exterior_color: string | null;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  fuel: string | null;
  title_status: string | null;
  location: string | null;
  source_type: VehicleSourceType;
  public_price_mode: PublicPriceMode;
  status: "draft";
  published: false;
  featured: false;
  description: string | null;
  price: null;
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
  "engine",
  "transmission",
  "drivetrain",
  "fuel",
  "title_status",
  "location",
  "source_type",
  "public_price_mode",
  "status",
  "published",
  "featured",
  "description",
  "price",
] as const;

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

  const damage = (opportunity.primary_damage ?? "").trim();
  const description = damage ? `Daño principal reportado: ${damage}.` : null;
  const extras = copartPublicDraftExtras(opportunity.auction_metadata);

  return {
    data: {
      vin: opportunity.vin,
      year,
      make,
      model,
      trim: opportunity.trim,
      mileage: opportunity.mileage,
      mileage_unit: "mi",
      exterior_color: extras.exterior_color,
      engine: extras.engine,
      transmission: extras.transmission,
      drivetrain: extras.drivetrain,
      fuel: extras.fuel,
      title_status: opportunity.title_status,
      location: opportunity.location,
      source_type: "other",
      public_price_mode: defaultPublicPriceMode("other"),
      status: "draft",
      published: false,
      featured: false,
      description,
      price: null,
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
