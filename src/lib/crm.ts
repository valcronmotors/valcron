import type { CompanySlug } from "@/lib/companies";

export const CRM_STATES = [
  "Nuevo Lead",
  "Contactado",
  "En Negociación",
  "Cotizado / Test Drive",
  "Cerrado Ganado",
  "Cerrado Perdido",
] as const;

export type CrmState = (typeof CRM_STATES)[number];

export const DEFAULT_CRM_STATE: CrmState = "Nuevo Lead";

export const LEAD_ORIGINS = ["Meta Ads", "WhatsApp", "Web", "Referido"] as const;

export type LeadOrigin = (typeof LEAD_ORIGINS)[number];

export const DEFAULT_LEAD_ORIGIN: LeadOrigin = "WhatsApp";

export const CRM_ACTIVITY_TYPES = [
  "Llamada",
  "Nota de voz",
  "Visita al dealer",
  "Recordatorio",
] as const;

export type CrmActivityType = (typeof CRM_ACTIVITY_TYPES)[number];

export const CRM_STATE_STYLES: Record<CrmState, string> = {
  "Nuevo Lead": "border-cyan-400/30 bg-cyan-400/10",
  Contactado: "border-teal-400/30 bg-teal-400/10",
  "En Negociación": "border-sky-400/30 bg-sky-400/10",
  "Cotizado / Test Drive": "border-violet-400/30 bg-violet-400/10",
  "Cerrado Ganado": "border-emerald-400/30 bg-emerald-400/10",
  "Cerrado Perdido": "border-rose-400/30 bg-rose-400/10",
};

export const CRM_STATE_PILL: Record<CrmState, string> = {
  "Nuevo Lead": "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30",
  Contactado: "bg-teal-500/15 text-teal-200 ring-teal-400/30",
  "En Negociación": "bg-sky-500/15 text-sky-200 ring-sky-400/30",
  "Cotizado / Test Drive": "bg-violet-500/15 text-violet-200 ring-violet-400/30",
  "Cerrado Ganado": "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30",
  "Cerrado Perdido": "bg-rose-500/15 text-rose-200 ring-rose-400/30",
};

export type ProspectoVehicle = {
  id: string;
  vin: string;
  marca: string;
  modelo: string;
  trim: string | null;
  ano: number;
  estado: string | null;
  precio_venta_dop: number | null;
  tasa_usd_dop: number | null;
  costo_total_usd: number | null;
};

export type ProspectoPart = {
  id: string;
  codigo_pieza: string;
  nombre: string;
  cantidad: number | null;
  precio_venta: number | null;
  envio_usd: number | null;
};

export type ProspectoRow = {
  id: string;
  empresa_id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  vehiculo_interes_id: string | null;
  repuesto_interes_id: string | null;
  origen_lead: string;
  estado_crm: string;
  notas: string | null;
  created_at: string;
  vehiculo: ProspectoVehicle | null;
  repuesto: ProspectoPart | null;
  empresa: { id: string; nombre: string } | null;
};

export type CrmActividad = {
  id: string;
  prospecto_id: string;
  tipo: string;
  descripcion: string | null;
  programada_para: string | null;
  audio_url: string | null;
  created_at: string;
};

export type CotizacionItem = {
  descripcion: string;
  cantidad: number;
  precio_unitario_usd: number;
  precio_unitario_dop: number;
};

export type CotizacionRow = {
  id: string;
  prospecto_id: string;
  empresa_id: string;
  numero: string;
  tasa_usd_dop: number;
  items: CotizacionItem[];
  subtotal_usd: number;
  total_usd: number;
  total_dop: number;
  notas: string | null;
  created_at: string;
};

export const PROSPECTO_SELECT =
  "id, empresa_id, nombre, telefono, email, vehiculo_interes_id, repuesto_interes_id, origen_lead, estado_crm, notas, created_at, vehiculo:vehiculos!vehiculo_interes_id (id, vin, marca, modelo, trim, ano, estado, precio_venta_dop, tasa_usd_dop, costo_total_usd), repuesto:repuestos!repuesto_interes_id (id, codigo_pieza, nombre, cantidad, precio_venta, envio_usd), empresa:empresas!empresa_id (id, nombre)";

export function isCrmState(value: string): value is CrmState {
  return CRM_STATES.includes(value as CrmState);
}

export function isLeadOrigin(value: string): value is LeadOrigin {
  return LEAD_ORIGINS.includes(value as LeadOrigin);
}

export function isCrmActivityType(value: string): value is CrmActivityType {
  return CRM_ACTIVITY_TYPES.includes(value as CrmActivityType);
}

export function interestLabel(row: ProspectoRow) {
  if (row.vehiculo) {
    const trim = row.vehiculo.trim ? ` ${row.vehiculo.trim}` : "";
    return `${row.vehiculo.marca} ${row.vehiculo.modelo}${trim} ${row.vehiculo.ano}`;
  }
  if (row.repuesto) {
    return `${row.repuesto.codigo_pieza} · ${row.repuesto.nombre}`;
  }
  return "Sin inventario asignado";
}

export function companySlugFromNombre(
  nombre: string | null | undefined,
): CompanySlug | null {
  const normalized = (nombre ?? "").toLowerCase();
  if (normalized.includes("108")) {
    return "108-parts-direct-llc";
  }
  if (normalized.includes("valcron")) {
    return "valcron-motors-group-srl";
  }
  return null;
}

export function whatsappHref(phone: string | null | undefined) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  const international =
    digits.length === 10 && !digits.startsWith("1") ? `1${digits}` : digits;
  return `https://wa.me/${international}`;
}

export type ProspectoQueryRow = Omit<
  ProspectoRow,
  "vehiculo" | "repuesto" | "empresa"
> & {
  vehiculo?: ProspectoVehicle | ProspectoVehicle[] | null;
  repuesto?: ProspectoPart | ProspectoPart[] | null;
  empresa?: { id: string; nombre: string } | { id: string; nombre: string }[] | null;
};

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function normalizeProspecto(row: ProspectoQueryRow): ProspectoRow {
  return {
    ...row,
    vehiculo: asSingle(row.vehiculo),
    repuesto: asSingle(row.repuesto),
    empresa: asSingle(row.empresa),
  };
}

export function parseCotizacionItems(value: unknown): CotizacionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const row = item as Record<string, unknown>;
    return [
      {
        descripcion: String(row.descripcion ?? "").trim() || "Ítem",
        cantidad: Number(row.cantidad ?? 1) || 1,
        precio_unitario_usd: Number(row.precio_unitario_usd ?? 0) || 0,
        precio_unitario_dop: Number(row.precio_unitario_dop ?? 0) || 0,
      },
    ];
  });
}
