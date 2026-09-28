import { cache } from "react";
import {
  filterAuctionCatalogVehicles,
  filterLocalStockVehicles,
} from "@/lib/catalogs";
import { publicInventoryDisplayError } from "@/lib/public-empty";
import {
  getAllPublicVehicles,
  getFeaturedVehicles,
  getPublicVehicleBySlug,
  getPublicVehicles,
} from "@/lib/vehicles/adapter";
import type { PublicVehicle } from "@/types/vehicle";

export async function loadPublicVehicles(options?: { limit?: number }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const result = await getAllPublicVehicles();
  return {
    data: options?.limit ? result.data.slice(0, options.limit) : result.data,
    error: publicInventoryDisplayError(result.error),
  };
}

/** Published local/Valcron stock only — never auction-origin. */
export async function loadLocalStockVehicles(options?: { limit?: number }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const result = await getAllPublicVehicles();
  const local = filterLocalStockVehicles(result.data);
  return {
    data: options?.limit ? local.slice(0, options.limit) : local,
    error: publicInventoryDisplayError(result.error),
  };
}

/** Published auction opportunities only — never local stock. */
export async function loadAuctionCatalogVehicles(options?: { limit?: number }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const result = await getAllPublicVehicles();
  const auctions = filterAuctionCatalogVehicles(result.data);
  return {
    data: options?.limit ? auctions.slice(0, options.limit) : auctions,
    error: publicInventoryDisplayError(result.error),
  };
}

export const loadPublicVehicleById = cache(async (id: string): Promise<{
  data: PublicVehicle | null;
  error: string | null;
}> => {
  const result = await getPublicVehicleBySlug(id);
  return {
    data: result.data,
    error: publicInventoryDisplayError(result.error),
  };
});

export { getFeaturedVehicles, getPublicVehicleBySlug, getPublicVehicles };
