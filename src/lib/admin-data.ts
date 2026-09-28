import { publicActionError } from "@/lib/action-errors";
import {
  filterLocalStockRows,
  inquiryCatalogKind,
  LOCAL_STOCK_SOURCE_TYPES,
  type InquiryCatalogKind,
} from "@/lib/catalogs";
import { VEHICLE_ADMIN_SELECT } from "@/lib/inventory";
import { isMissingPublicPriceModeColumn, vehicleSelectWithoutPublicPriceMode } from "@/lib/public-price-mode";
import { createClient } from "@/utils/supabase/server";
import type { InquiryRow, VehicleRow, VehicleSourceType } from "@/lib/website-schema";

export const DASHBOARD_VEHICLE_SELECT =
  "id, year, make, model, trim, status, published, featured, price, currency, source_type, updated_at";

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
  | "source_type"
  | "updated_at"
>;

export type DashboardInquiry = Pick<
  InquiryRow,
  "id" | "status" | "name" | "message" | "created_at" | "vehicle_id"
>;

/** Local Inventario Valcron only — excludes auction-origin (source_type = other). */
export async function getValcronVehicles() {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_ADMIN_SELECT)
    .in("source_type", [...LOCAL_STOCK_SOURCE_TYPES])
    .order("updated_at", { ascending: false });
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(VEHICLE_ADMIN_SELECT))
      .in("source_type", [...LOCAL_STOCK_SOURCE_TYPES])
      .order("updated_at", { ascending: false }));
  }

  const rows = (data ?? []) as unknown as VehicleRow[];
  return {
    vehicles: filterLocalStockRows(rows),
    error: error ? publicActionError(error, "No pudimos cargar el inventario.") : null,
  };
}

/** Published auction-origin vehicles linked for website (source_type = other). */
export async function getAuctionCatalogVehiclesAdmin() {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_ADMIN_SELECT)
    .eq("source_type", "other")
    .order("updated_at", { ascending: false });
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(VEHICLE_ADMIN_SELECT))
      .eq("source_type", "other")
      .order("updated_at", { ascending: false }));
  }

  return {
    vehicles: (data ?? []) as unknown as VehicleRow[],
    error: error ? publicActionError(error, "No pudimos cargar las oportunidades publicadas.") : null,
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

export type AdminInquiryView = InquiryRow & {
  catalogKind: InquiryCatalogKind;
  vehicleTitle: string | null;
};

export async function getAdminInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const inquiries = (data ?? []) as unknown as InquiryRow[];
  const vehicleIds = [
    ...new Set(inquiries.map((row) => row.vehicle_id).filter((id): id is string => Boolean(id))),
  ];

  const vehicleMeta = new Map<
    string,
    { source_type: VehicleSourceType; year: number; make: string; model: string }
  >();
  if (vehicleIds.length > 0) {
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, source_type, year, make, model")
      .in("id", vehicleIds);
    for (const vehicle of (vehicles ?? []) as Array<{
      id: string;
      source_type: VehicleSourceType;
      year: number;
      make: string;
      model: string;
    }>) {
      vehicleMeta.set(vehicle.id, vehicle);
    }
  }

  const views: AdminInquiryView[] = inquiries.map((row) => {
    const meta = row.vehicle_id ? vehicleMeta.get(row.vehicle_id) : undefined;
    const catalogKind = inquiryCatalogKind({
      auctionOpportunityId: row.auction_opportunity_id,
      sourceType: meta?.source_type,
      vehicleId: row.vehicle_id,
    });
    const vehicleTitle = meta
      ? `${meta.year} ${meta.make} ${meta.model}`.replace(/\s+/g, " ").trim()
      : null;
    return { ...row, catalogKind, vehicleTitle };
  });

  return {
    inquiries: views,
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
