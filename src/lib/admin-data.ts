import { publicActionError } from "@/lib/action-errors";
import { VEHICLE_ADMIN_SELECT } from "@/lib/inventory";
import { isMissingPublicPriceModeColumn, vehicleSelectWithoutPublicPriceMode } from "@/lib/public-price-mode";
import { createClient } from "@/utils/supabase/server";
import type { InquiryRow, VehicleRow } from "@/lib/website-schema";

export const DASHBOARD_VEHICLE_SELECT =
  "id, year, make, model, trim, status, published, featured, price, currency, updated_at";

export type DashboardVehicle = Pick<
  VehicleRow,
  | "id"
  | "year"
  | "make"
  | "model"
  | "trim"
  | "status"
  | "published"
  | "featured"
  | "price"
  | "currency"
  | "updated_at"
>;

export type DashboardInquiry = Pick<
  InquiryRow,
  "id" | "status" | "name" | "message" | "created_at" | "vehicle_id"
>;

export async function getValcronVehicles() {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_ADMIN_SELECT)
    .order("updated_at", { ascending: false });
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(VEHICLE_ADMIN_SELECT))
      .order("updated_at", { ascending: false }));
  }

  return {
    vehicles: (data ?? []) as unknown as VehicleRow[],
    error: error ? publicActionError(error, "No pudimos cargar el inventario.") : null,
  };
}

export async function getAdminVehicle(id: string) {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_ADMIN_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(VEHICLE_ADMIN_SELECT))
      .eq("id", id)
      .maybeSingle());
  }

  return {
    vehicle: (data ?? null) as unknown as VehicleRow | null,
    error: error ? publicActionError(error, "No pudimos cargar el vehículo.") : null,
  };
}

export async function getAdminInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    inquiries: (data ?? []) as unknown as InquiryRow[],
    error: error ? publicActionError(error, "No pudimos cargar las solicitudes.") : null,
  };
}

export async function getAdminDashboardSnapshot() {
  const supabase = await createClient();
  const [vehicles, inquiries, auctions] = await Promise.all([
    supabase.from("vehicles").select(DASHBOARD_VEHICLE_SELECT).order("updated_at", { ascending: false }),
    supabase
      .from("inquiries")
      .select("id, status, name, message, created_at, vehicle_id")
      .order("created_at", { ascending: false }),
    supabase.from("auction_opportunities").select("id", { count: "exact", head: true }),
  ]);

  return {
    vehicles: (vehicles.data ?? []) as unknown as DashboardVehicle[],
    inquiries: (inquiries.data ?? []) as unknown as DashboardInquiry[],
    auctionCount: auctions.count ?? 0,
    error: vehicles.error
      ? publicActionError(vehicles.error, "No pudimos cargar el panel.")
      : inquiries.error
        ? publicActionError(inquiries.error, "No pudimos cargar el panel.")
        : auctions.error
          ? publicActionError(auctions.error, "No pudimos cargar el panel.")
          : null,
  };
}
