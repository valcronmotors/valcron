export type { PublicVehicle, VehicleQuery, VehicleListResult } from "@/types/vehicle";
export type { VehicleRow as PublicVehicleRow } from "@/lib/website-schema";
export { PUBLIC_VEHICLE_SELECT, normalizeVehicle } from "@/lib/vehicles/normalizeVehicle";
export { getFeaturedVehicles, getPublicVehicleBySlug, getPublicVehicles, getSimilarVehicles } from "@/lib/vehicles/adapter";
export { buildVehicleWhatsAppUrl, vehicleDisplayTitle as publicVehicleTitle } from "@/lib/vehicles/vehicle-formatters";
export { publicListingBadge } from "@/lib/vehicles/vehicle-status";
