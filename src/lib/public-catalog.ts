import { COMPANY_NAMES } from "@/lib/companies";

export const PUBLIC_VEHICLE_SELECT =
  "id, vin, marca, modelo, trim, trim_version, ano, precio_venta_dop, fotos_urls";

export const PUBLIC_CATALOG_ORIGIN = "https://valcronmotors.com";

const ALLOWED_ORIGINS = new Set([
  PUBLIC_CATALOG_ORIGIN,
  "https://www.valcronmotors.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export type PublicVehicle = {
  id: string;
  vin: string;
  marca: string;
  modelo: string;
  ano: number;
  trim: string | null;
  precioVentaDop: number;
  fotosUrls: string[];
  especificaciones: {
    marca: string;
    modelo: string;
    ano: number;
    version: string | null;
    vin: string;
  };
};

export type PublicVehicleRow = {
  id: string;
  vin: string;
  marca: string;
  modelo: string;
  trim: string | null;
  trim_version?: string | null;
  ano: number;
  precio_venta_dop: number | null;
  fotos_urls: string[] | null;
};

export function dealerWhatsappDigits() {
  const raw = process.env.NEXT_PUBLIC_VALCRON_WHATSAPP ?? "18095550100";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && !digits.startsWith("1")) {
    return `1${digits}`;
  }
  return digits;
}

export function vehicleInterestMessage(vehicle: {
  marca: string;
  modelo: string;
  ano: number;
  vin: string;
}) {
  return `Hola, me interesa el ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} con VIN ${vehicle.vin} visto en valcronmotors.com`;
}

export function catalogWhatsappHref(vehicle: {
  marca: string;
  modelo: string;
  ano: number;
  vin: string;
}) {
  const phone = dealerWhatsappDigits();
  if (!phone) {
    return null;
  }
  const text = encodeURIComponent(vehicleInterestMessage(vehicle));
  return `https://wa.me/${phone}?text=${text}`;
}

export function toPublicVehicle(row: PublicVehicleRow): PublicVehicle {
  const trim = row.trim || row.trim_version || null;
  const fotosUrls = (row.fotos_urls ?? []).filter((url) =>
    /^https?:\/\//i.test(url),
  );

  return {
    id: row.id,
    vin: row.vin,
    marca: row.marca,
    modelo: row.modelo,
    ano: row.ano,
    trim,
    precioVentaDop: Number(row.precio_venta_dop ?? 0),
    fotosUrls,
    especificaciones: {
      marca: row.marca,
      modelo: row.modelo,
      ano: row.ano,
      version: trim,
      vin: row.vin,
    },
  };
}

export function publicVehicleTitle(vehicle: Pick<PublicVehicle, "marca" | "modelo" | "ano" | "trim">) {
  const version = vehicle.trim ? ` ${vehicle.trim}` : "";
  return `${vehicle.marca} ${vehicle.modelo}${version} ${vehicle.ano}`;
}

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowOrigin =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : PUBLIC_CATALOG_ORIGIN;

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

export const VALCRON_PUBLIC_COMPANY = COMPANY_NAMES.valcron;
