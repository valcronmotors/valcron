import { getAllPublicVehicles, getFeaturedVehicles, getPublicVehicleBySlug, getPublicVehicles } from "@/lib/vehicles/adapter";
import type { PublicVehicle } from "@/types/vehicle";

export async function loadPublicVehicles(options?: { limit?: number }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const result = await getAllPublicVehicles();
  return {
    data: options?.limit ? result.data.slice(0, options.limit) : result.data,
    error: result.error,
  };
}

export async function loadPublicVehicleById(id: string): Promise<{
  data: PublicVehicle | null;
  error: string | null;
}> {
  return getPublicVehicleBySlug(id);
}

export { getFeaturedVehicles, getPublicVehicleBySlug, getPublicVehicles };
