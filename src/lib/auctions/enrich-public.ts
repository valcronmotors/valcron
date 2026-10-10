import { readAuctionMetadata } from "@/lib/auction-admin-fields";
import { historicalProviderLabel } from "@/lib/auctions/opportunity-admin";
import type { AuctionOpportunityRow } from "@/lib/website-schema";
import type { AuctionPlatform, PublicVehicle, VehicleSource } from "@/types/vehicle";
import type { SupabaseClient } from "@supabase/supabase-js";

function platformFromProvider(provider: AuctionOpportunityRow["provider"]): AuctionPlatform {
  if (provider === "copart") return "copart";
  if (provider === "iaa") return "iaai";
  if (provider === "manheim") return "manheim";
  return "other";
}

function sourceFromProvider(provider: AuctionOpportunityRow["provider"]): VehicleSource {
  if (provider === "copart") return "copart";
  if (provider === "iaa") return "iaai";
  if (provider === "manheim") return "manheim";
  return "manual";
}

export function applyOpportunityToPublicVehicle(
  vehicle: PublicVehicle,
  opportunity: Pick<
    AuctionOpportunityRow,
    "provider" | "provider_lot_id" | "source_url" | "primary_damage" | "auction_metadata" | "vin"
  >,
): PublicVehicle {
  const meta = readAuctionMetadata(opportunity.auction_metadata);
  const platform = platformFromProvider(opportunity.provider);
  const buyNow =
    meta.price_mode === "buy_now" && meta.buy_now_usd != null && meta.buy_now_usd > 0
      ? meta.buy_now_usd
      : vehicle.pricing.buyNowPrice;

  return {
    ...vehicle,
    source: sourceFromProvider(opportunity.provider),
    sourceUrl: opportunity.source_url ?? vehicle.sourceUrl,
    vin: opportunity.vin ?? vehicle.vin,
    primaryDamage: opportunity.primary_damage ?? vehicle.primaryDamage,
    secondaryDamage: meta.secondary_damage ?? vehicle.secondaryDamage,
    runAndDrive: meta.run_and_drive ? meta.run_and_drive !== "Not Running" && meta.run_and_drive !== "Not Reported" : vehicle.runAndDrive,
    keysAvailable: meta.keys === "Yes" ? true : meta.keys === "No" ? false : vehicle.keysAvailable,
    fuenteSubasta: historicalProviderLabel(opportunity.provider),
    pricing: {
      ...vehicle.pricing,
      buyNowPrice: buyNow,
      kind: meta.price_mode === "buy_now" ? "buy_now" : vehicle.pricing.kind,
    },
    auction: {
      platform,
      lotNumber: opportunity.provider_lot_id,
      sourceUrl: opportunity.source_url,
      saleDate: meta.auction_date,
      saleStatus: meta.auction_sale_status,
      buyNowPrice: buyNow,
    },
  };
}

export async function enrichPublicVehiclesWithOpportunities(
  supabase: SupabaseClient,
  vehicles: PublicVehicle[],
): Promise<PublicVehicle[]> {
  const auctionIds = vehicles.filter((vehicle) => vehicle.listingKind === "auction").map((vehicle) => vehicle.id);
  if (!auctionIds.length) return vehicles;

  const { data, error } = await supabase
    .from("auction_opportunities")
    .select("provider, provider_lot_id, source_url, primary_damage, auction_metadata, vin, linked_vehicle_id")
    .in("linked_vehicle_id", auctionIds);

  if (error || !data?.length) {
    return vehicles;
  }

  const byVehicle = new Map<string, (typeof data)[number]>();
  for (const row of data) {
    if (row.linked_vehicle_id) {
      byVehicle.set(row.linked_vehicle_id, row);
    }
  }

  return vehicles.map((vehicle) => {
    const opportunity = byVehicle.get(vehicle.id);
    if (!opportunity) return vehicle;
    return applyOpportunityToPublicVehicle(vehicle, opportunity as AuctionOpportunityRow);
  });
}
