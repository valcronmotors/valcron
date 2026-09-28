import { isAuctionOpportunitySource } from "@/lib/vehicles/vehicle-status";
import type { PublicVehicle } from "@/types/vehicle";
import type { VehicleRow, VehicleSourceType } from "@/lib/website-schema";

/** Local Valcron-controlled stock (not auction-origin). */
export const LOCAL_STOCK_SOURCE_TYPES = ["valcron_stock", "consignment", "trade_in"] as const;

export type CatalogKind = "local" | "auction";

export function isLocalStockSource(sourceType: VehicleSourceType | null | undefined) {
  return sourceType === "valcron_stock" || sourceType === "consignment" || sourceType === "trade_in";
}

export function isAuctionCatalogSource(sourceType: VehicleSourceType | null | undefined) {
  return isAuctionOpportunitySource(sourceType);
}

export function isLocalStockVehicle(
  vehicle: Pick<PublicVehicle, "listingKind" | "availability">,
) {
  return vehicle.listingKind === "dealer" && vehicle.availability !== "auction";
}

export function isAuctionCatalogVehicle(
  vehicle: Pick<PublicVehicle, "listingKind" | "availability">,
) {
  return vehicle.listingKind === "auction" || vehicle.availability === "auction";
}

export function filterLocalStockVehicles(vehicles: PublicVehicle[]) {
  return vehicles.filter(
    (vehicle) => isLocalStockVehicle(vehicle) && vehicle.availability !== "sold",
  );
}

export function filterAuctionCatalogVehicles(vehicles: PublicVehicle[]) {
  return vehicles.filter(
    (vehicle) => isAuctionCatalogVehicle(vehicle) && vehicle.availability !== "sold",
  );
}

export function isLocalStockRow(row: Pick<VehicleRow, "source_type">) {
  return isLocalStockSource(row.source_type);
}

export function isAuctionCatalogRow(row: Pick<VehicleRow, "source_type">) {
  return isAuctionCatalogSource(row.source_type);
}

export function filterLocalStockRows<T extends Pick<VehicleRow, "source_type">>(rows: T[]) {
  return rows.filter(isLocalStockRow);
}

export function filterAuctionCatalogRows<T extends Pick<VehicleRow, "source_type">>(rows: T[]) {
  return rows.filter(isAuctionCatalogRow);
}

/** Admin Solicitudes context — Inventario Valcron vs Subasta vs general. */
export type InquiryCatalogKind = "local" | "auction" | "general";

export function inquiryCatalogKind(input: {
  auctionOpportunityId?: string | null;
  sourceType?: VehicleSourceType | null;
  vehicleId?: string | null;
}): InquiryCatalogKind {
  if (input.auctionOpportunityId) return "auction";
  if (input.sourceType != null) {
    return isAuctionCatalogSource(input.sourceType) ? "auction" : "local";
  }
  if (input.vehicleId) return "local";
  return "general";
}

export function inquiryCatalogLabel(kind: InquiryCatalogKind) {
  if (kind === "auction") return "Subasta";
  if (kind === "local") return "Inventario Valcron";
  return "Consulta general";
}
