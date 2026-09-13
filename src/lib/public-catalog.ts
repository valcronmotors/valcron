import { DEFAULT_TASA_USD_DOP } from "@/lib/vehicle-costs";
import { SITE } from "@/lib/site";

export const PUBLIC_VEHICLE_SELECT =
  "id, vin, marca, modelo, trim, trim_version, ano, precio_venta_dop, tasa_usd_dop, fotos_urls, estado, fuente_subasta, ubicacion_lote";

export const PUBLIC_CATALOG_ORIGIN = "https://valcronmotors.com";

const ALLOWED_ORIGINS = new Set([
  PUBLIC_CATALOG_ORIGIN,
  "https://www.valcronmotors.com",
  "https://admin.valcronmotors.com",
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
  precioVentaUsd: number;
  tasaUsdDop: number;
  fotosUrls: string[];
  estado: string;
  fuenteSubasta: string | null;
  ubicacion: string;
  listingKind: "dealer" | "auction";
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
  tasa_usd_dop?: number | null;
  fotos_urls: string[] | null;
  estado?: string | null;
  fuente_subasta?: string | null;
  ubicacion_lote?: string | null;
};

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
  const fuente = (value ?? "").trim().toLowerCase();
  return fuente === "copart" || fuente === "manheim";
}

export function isPublicVehicleListing(row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">) {
  const estado = row.estado ?? "";
  if (estado === "Disponible") {
    return true;
  }

  return estado === "En Subasta" && (isCopartOrManheim(row.fuente_subasta) || !row.fuente_subasta);
}

export function listingKindFromRow(
  row: Pick<PublicVehicleRow, "estado" | "fuente_subasta">,
): "dealer" | "auction" {
  if (row.estado === "En Subasta" || isCopartOrManheim(row.fuente_subasta)) {
    return "auction";
  }

  return "dealer";
}

export function publicVehicleLocation(row: PublicVehicleRow) {
  if (listingKindFromRow(row) === "auction") {
    const source = row.fuente_subasta
      ? `Subasta ${row.fuente_subasta}`
      : "Subasta Copart / Manheim";
    return row.ubicacion_lote ? `${source} · ${row.ubicacion_lote}` : source;
  }

  return "Stock en RD · Santo Domingo Este";
}

export function vehicleInterestMessage(vehicle: {
  marca: string;
  modelo: string;
  ano: number;
  vin: string;
  listingKind?: "dealer" | "auction";
}) {
  if (vehicle.listingKind === "auction") {
    return `Hola, quiero importar por encargo el ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} (VIN ${vehicle.vin}) visto en valcronmotors.com`;
  }

  return `Hola, me interesa el ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} con VIN ${vehicle.vin} visto en valcronmotors.com`;
}

export function catalogWhatsappHref(vehicle: {
  marca: string;
  modelo: string;
  ano: number;
  vin: string;
  listingKind?: "dealer" | "auction";
}) {
  const phone = dealerWhatsappDigits();
  if (!phone) {
    return null;
  }
  const text = encodeURIComponent(vehicleInterestMessage(vehicle));
  return `https://wa.me/${phone}?text=${text}`;
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

export function toPublicVehicle(row: PublicVehicleRow): PublicVehicle {
  const trim = row.trim || row.trim_version || null;
  const fotosUrls = (row.fotos_urls ?? []).filter((url) =>
    /^https?:\/\//i.test(url),
  );
  const tasaUsdDop = Number(row.tasa_usd_dop ?? 0) > 0
    ? Number(row.tasa_usd_dop)
    : DEFAULT_TASA_USD_DOP;
  const precioVentaDop = Number(row.precio_venta_dop ?? 0);
  const precioVentaUsd = Math.round((precioVentaDop / tasaUsdDop) * 100) / 100;
  const estado = row.estado || "Disponible";
  const listingKind = listingKindFromRow({ estado, fuente_subasta: row.fuente_subasta });

  return {
    id: row.id,
    vin: row.vin,
    marca: row.marca,
    modelo: row.modelo,
    ano: row.ano,
    trim,
    precioVentaDop,
    precioVentaUsd,
    tasaUsdDop,
    fotosUrls,
    estado,
    fuenteSubasta: row.fuente_subasta || null,
    ubicacion: publicVehicleLocation(row),
    listingKind,
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

export const VALCRON_PUBLIC_COMPANY = SITE.name;
