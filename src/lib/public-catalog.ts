import { SITE } from "@/lib/site";
import { PUBLIC_VEHICLE_SELECT, normalizeVehicle } from "@/lib/vehicles/normalizeVehicle";
import { buildVehicleWhatsAppUrl, vehicleDisplayTitle } from "@/lib/vehicles/vehicle-formatters";
import { isAuctionSource, listingKindFromAvailability, vehicleAvailabilityFromRow } from "@/lib/vehicles/vehicle-status";
import { isPublicCatalogListing } from "@/lib/website-schema";
import type { PublicVehicle } from "@/types/vehicle";
import type { VehicleRow } from "@/lib/website-schema";

export { PUBLIC_VEHICLE_SELECT };
export type PublicVehicleRow = VehicleRow;

export const PUBLIC_CATALOG_ORIGIN = "https://valcronmotors.com";

const ALLOWED_ORIGINS = new Set([
  PUBLIC_CATALOG_ORIGIN,
  "https://www.valcronmotors.com",
  "https://admin.valcronmotors.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export type { PublicVehicle };

export function isVinQuery(value: string) {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(value.trim());
}

export function dealerWhatsappDigits() {
  const raw = process.env.NEXT_PUBLIC_VALCRON_WHATSAPP ?? SITE.whatsappDigits;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && !digits.startsWith("1")) {
    return `1${digits}`;
  }
  return digits;
}

export function isCopartOrManheim(value: string | null | undefined) {
  return isAuctionSource(value);
}

export function isPublicVehicleListing(row: Pick<VehicleRow, "published" | "status">) {
  return isPublicCatalogListing(row);
}

export function listingKindFromRow(row: Pick<VehicleRow, "status" | "source_type">): "dealer" | "auction" {
  return listingKindFromAvailability(vehicleAvailabilityFromRow(row));
}

export function publicVehicleLocation(row: VehicleRow) {
  return normalizeVehicle(row).location ?? "";
}

export function vehicleInterestMessage(vehicle: {
  marca?: string;
  modelo?: string;
  ano?: number;
  make?: string;
  model?: string;
  year?: number;
  trim?: string | null;
  vin?: string;
  listingKind?: "dealer" | "auction";
}) {
  const year = vehicle.year ?? vehicle.ano;
  const make = vehicle.make ?? vehicle.marca;
  const model = vehicle.model ?? vehicle.modelo;
  return `Hola, estoy interesado en el ${year} ${make} ${model} que vi en Valcron Motors.`;
}

export function catalogWhatsappHref(vehicle: PublicVehicle) {
  return buildVehicleWhatsAppUrl(vehicle);
}

export function dealerWhatsappHref(message?: string) {
  const phone = dealerWhatsappDigits();
  if (!phone) {
    return null;
  }
  if (!message) {
    return `https://wa.me/${phone}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function toPublicVehicle(row: VehicleRow): PublicVehicle {
  return normalizeVehicle(row);
}

export function publicVehicleTitle(
  vehicle: Pick<PublicVehicle, "marca" | "modelo" | "ano" | "trim" | "make" | "model" | "year">,
) {
  return vehicleDisplayTitle(vehicle);
}

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : PUBLIC_CATALOG_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function publicJson(request: Request, body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: corsHeaders(request),
  });
}

export function publicOptions(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export const VALCRON_PUBLIC_COMPANY = SITE.name;
