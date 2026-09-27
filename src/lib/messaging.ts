import { formatMoneyPlain, vehicleLabel, type VehicleMetrics } from "@/lib/admin-metrics";
import { SITE } from "@/lib/site";

export const MESSAGE_CHANNELS = ["whatsapp", "instagram", "facebook"] as const;
export type MessageChannel = (typeof MESSAGE_CHANNELS)[number];

export const INBOX_STATUSES = ["ia", "humano"] as const;
export type InboxStatus = (typeof INBOX_STATUSES)[number];

export const MESSAGE_AUTHORS = ["cliente", "ia", "agente", "interno"] as const;
export type MessageAuthor = (typeof MESSAGE_AUTHORS)[number];

export const INBOX_FILTERS = ["todos", "ia", "humano"] as const;
export type InboxFilter = (typeof INBOX_FILTERS)[number];

export type InboxConversation = {
  id: string;
  prospectoId: string | null;
  canal: MessageChannel;
  status: InboxStatus;
  iaPilot: boolean;
  asignadoA: string | null;
  asignadoNombre: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
  leadNombre: string;
  leadTelefono: string | null;
  leadEtapa: string | null;
  vehiculoInteres: string | null;
  vehiculoInteresId: string | null;
};

export type InboxMessage = {
  id: string;
  conversacionId: string;
  autor: MessageAuthor;
  canal: MessageChannel | "interno";
  contenido: string;
  vehiculoId: string | null;
  createdAt: string;
};

export type IaConfigView = {
  whatsappConfigured: boolean;
  instagramConfigured: boolean;
  facebookConfigured: boolean;
  whatsappMasked: string;
  instagramMasked: string;
  facebookMasked: string;
  webhookMasked: string;
  phoneNumberId: string;
  wabaId: string;
  promptBase: string;
  webhookUrl: string;
};

export const DEFAULT_IA_PROMPT = `Eres el Asesor Comercial IA de Valcron Motors Group SRL, dealer de importación y financiamiento en Santo Domingo Este (${SITE.address.full}). Oficina +1 (809) 623-9381. WhatsApp +1 (829) 321-1271. No cites un correo electrónico de la empresa.

Reglas:
1. Consulta únicamente inventario real en Supabase (tabla vehiculos). Prioriza estados Disponible y En Subasta. Nunca inventes VIN, precios, lotes ni unidades.
2. Si preguntan por importación o subasta, explica el proceso usando Copart e IAA como plataformas de mercado, landing cost, flete, DGA y tiempos. No prometas un lote que no esté en el sistema. No presentes esas plataformas como socias.
3. Sobre la Ley 103-13, da orientación general de incentivos a vehículos energéticamente eficientes e indica que la elegibilidad la confirma un asesor humano.
4. Tono ejecutivo, claro y en español. Si no tienes el dato, ofrece pasar con un vendedor.
5. No reveles costos internos, márgenes, tokens ni datos fiscales de la empresa.`;

export function isMessageChannel(value: string): value is MessageChannel {
  return MESSAGE_CHANNELS.includes(value as MessageChannel);
}

export function isInboxStatus(value: string): value is InboxStatus {
  return INBOX_STATUSES.includes(value as InboxStatus);
}

export function isMessageAuthor(value: string): value is MessageAuthor {
  return MESSAGE_AUTHORS.includes(value as MessageAuthor);
}

export function canalFromOrigen(origen: string | null | undefined): MessageChannel {
  const value = (origen ?? "").toLowerCase();
  if (value.includes("instagram")) {
    return "instagram";
  }
  if (value.includes("facebook") || value.includes("meta")) {
    return "facebook";
  }
  return "whatsapp";
}

export function canalLabel(canal: MessageChannel | "interno") {
  if (canal === "whatsapp") return "WhatsApp";
  if (canal === "instagram") return "Instagram";
  if (canal === "facebook") return "Facebook";
  return "Nota interna";
}

export function autorLabel(autor: MessageAuthor) {
  if (autor === "ia") return "IA Pilot";
  if (autor === "agente") return "Asesor";
  if (autor === "interno") return "Nota interna";
  return "Cliente";
}

export function maskSecret(value: string | null | undefined) {
  const token = (value ?? "").trim();
  if (!token) {
    return { configured: false, masked: "Sin configurar" };
  }
  if (token.length <= 4) {
    return { configured: true, masked: "••••" };
  }
  return { configured: true, masked: `•••• ${token.slice(-4)}` };
}

export function vehicleFichaText(vehicle: VehicleMetrics) {
  const precio = formatMoneyPlain(Number(vehicle.price ?? 0), vehicle.currency);
  return [
    `Ficha de vehículo — ${vehicleLabel(vehicle)}`,
    `VIN: ${vehicle.vin ?? "—"}`,
    `Estado: ${vehicle.status}`,
    `Precio: ${precio}`,
  ].join("\n");
}

export function draftIaReply(input: {
  nombre: string;
  pregunta?: string | null;
  vehiculo?: string | null;
  stock: VehicleMetrics[];
}) {
  const available = input.stock.filter((row) => row.published && row.status === "available");
  const first = available[0];
  const stockLine = first
    ? `En inventario actual tenemos ${vehicleLabel(first)} (${first.status}, ${formatMoneyPlain(Number(first.price ?? 0), first.currency)}).`
    : "En este momento estoy confirmando unidades exactas con el equipo de piso.";
  const interest = input.vehiculo
    ? `Vi tu interés en ${input.vehiculo}. `
    : "";
  return `Hola ${input.nombre.split(" ")[0]}, soy el Asesor IA de Valcron Motors. ${interest}${stockLine} También podemos buscar unidades en plataformas de subasta como Copart e IAA. Si aplica Ley 103-13, un asesor humano valida la elegibilidad. ¿Te paso con un vendedor o agendamos visita en ${SITE.address.street}?`;
}
