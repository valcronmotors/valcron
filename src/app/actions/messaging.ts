"use server";

import { revalidatePath } from "next/cache";
import { getValcronProspectos, getValcronVehicles } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import {
  canalFromOrigen,
  draftIaReply,
  isInboxStatus,
  isMessageAuthor,
  isMessageChannel,
  vehicleFichaText,
  type InboxConversation,
  type InboxMessage,
  type InboxStatus,
  type MessageAuthor,
  type MessageChannel,
} from "@/lib/messaging";
import { createClient } from "@/utils/supabase/server";

export type MessagingActionState = {
  error: string | null;
  success?: string | null;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_RE.test(value);
}

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function revalidateInbox() {
  revalidatePath("/admin/mensajeria", "layout");
}

type ConversationRow = {
  id: string;
  prospecto_id: string | null;
  canal: string;
  status: string;
  ia_pilot: boolean;
  asignado_a: string | null;
  asignado_nombre: string | null;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
};

type MessageRow = {
  id: string;
  conversacion_id: string;
  autor: string;
  canal: string;
  contenido: string;
  vehiculo_id: string | null;
  created_at: string;
};

function mapConversation(
  row: ConversationRow,
  lead?: {
    nombre: string;
    telefono: string | null;
    estado_crm: string | null;
    vehiculo: { marca: string; modelo: string; ano: number; trim: string | null } | null;
    vehiculo_interes_id: string | null;
  },
): InboxConversation {
  const vehiculo = lead?.vehiculo;
  return {
    id: row.id,
    prospectoId: row.prospecto_id,
    canal: isMessageChannel(row.canal) ? row.canal : "whatsapp",
    status: isInboxStatus(row.status) ? row.status : "ia",
    iaPilot: Boolean(row.ia_pilot),
    asignadoA: row.asignado_a,
    asignadoNombre: row.asignado_nombre,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    unreadCount: Number(row.unread_count ?? 0),
    leadNombre: lead?.nombre ?? "Lead sin nombre",
    leadTelefono: lead?.telefono ?? null,
    leadEtapa: lead?.estado_crm ?? null,
    vehiculoInteres: vehiculo
      ? `${vehiculo.marca} ${vehiculo.modelo}${vehiculo.trim ? ` ${vehiculo.trim}` : ""} ${vehiculo.ano}`
      : null,
    vehiculoInteresId: lead?.vehiculo_interes_id ?? null,
  };
}

function mapMessage(row: MessageRow): InboxMessage {
  return {
    id: row.id,
    conversacionId: row.conversacion_id,
    autor: isMessageAuthor(row.autor) ? row.autor : "cliente",
    canal:
      row.canal === "interno" || isMessageChannel(row.canal)
        ? row.canal
        : "whatsapp",
    contenido: row.contenido,
    vehiculoId: row.vehiculo_id,
    createdAt: row.created_at,
  };
}

export async function syncInboxFromLeads() {
  await requireAdmin();
  const supabase = await createClient();
  const { prospectos } = await getValcronProspectos();
  const { data: existing } = await supabase
    .from("mensajeria_conversaciones")
    .select("id, prospecto_id");

  const byProspecto = new Map(
    (existing ?? [])
      .filter((row) => row.prospecto_id)
      .map((row) => [row.prospecto_id as string, row.id as string]),
  );

  for (const lead of prospectos) {
    if (byProspecto.has(lead.id)) {
      continue;
    }
    const canal = canalFromOrigen(lead.origen_lead);
    const { data, error } = await supabase
      .from("mensajeria_conversaciones")
      .insert({
        prospecto_id: lead.id,
        canal,
        status: "ia",
        ia_pilot: true,
        last_message: "Nueva conversación desde el CRM.",
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      continue;
    }

    const interest = lead.vehiculo
      ? `${lead.vehiculo.marca} ${lead.vehiculo.modelo} ${lead.vehiculo.ano}`
      : "el inventario";
    await supabase.from("mensajeria_mensajes").insert([
      {
        conversacion_id: data.id,
        autor: "cliente",
        canal,
        contenido: `Hola, quiero información de ${interest}.`,
      },
      {
        conversacion_id: data.id,
        autor: "ia",
        canal,
        contenido: `Hola ${lead.nombre.split(" ")[0]}, soy el Asesor IA de Valcron Motors. Revisé tu consulta sobre ${interest} y te ayudo con stock, importación Copart/IAAI/Manheim o financiamiento.`,
      },
    ]);
  }
}

export async function listInbox(): Promise<{
  conversations: InboxConversation[];
  error: string | null;
}> {
  await requireAdmin();
  await syncInboxFromLeads();
  const supabase = await createClient();
  const [{ prospectos, error: leadsError }, convResult] = await Promise.all([
    getValcronProspectos(),
    supabase
      .from("mensajeria_conversaciones")
      .select(
        "id, prospecto_id, canal, status, ia_pilot, asignado_a, asignado_nombre, last_message, last_message_at, unread_count",
      )
      .order("last_message_at", { ascending: false }),
  ]);

  if (convResult.error) {
    return { conversations: [], error: convResult.error.message };
  }

  const leads = new Map(prospectos.map((row) => [row.id, row]));
  const seenLeads = new Set<string>();
  const conversations = (convResult.data ?? [])
    .map((row) =>
      mapConversation(
        row as ConversationRow,
        leads.get(row.prospecto_id ?? "") ?? undefined,
      ),
    )
    .filter((row) => {
      if (!row.prospectoId) {
        return true;
      }
      if (seenLeads.has(row.prospectoId)) {
        return false;
      }
      seenLeads.add(row.prospectoId);
      return true;
    });

  return { conversations, error: leadsError };
}

export async function listInboxMessages(
  conversationId: string,
): Promise<{ messages: InboxMessage[]; error: string | null }> {
  await requireAdmin();
  if (!isUuid(conversationId)) {
    return { messages: [], error: "Conversación inválida." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mensajeria_mensajes")
    .select("id, conversacion_id, autor, canal, contenido, vehiculo_id, created_at")
    .eq("conversacion_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    return { messages: [], error: error.message };
  }

  return { messages: (data ?? []).map((row) => mapMessage(row as MessageRow)), error: null };
}

async function appendMessage(input: {
  conversationId: string;
  autor: MessageAuthor;
  canal: MessageChannel | "interno";
  contenido: string;
  vehiculoId?: string | null;
  unread?: boolean;
}) {
  const supabase = await createClient();
  const { data: conversation, error: lookupError } = await supabase
    .from("mensajeria_conversaciones")
    .select("id, canal")
    .eq("id", input.conversationId)
    .single();

  if (lookupError || !conversation) {
    return { error: lookupError?.message ?? "Conversación no encontrada." };
  }

  const canal =
    input.canal === "interno"
      ? "interno"
      : isMessageChannel(conversation.canal)
        ? conversation.canal
        : "whatsapp";

  const { error } = await supabase.from("mensajeria_mensajes").insert({
    conversacion_id: input.conversationId,
    autor: input.autor,
    canal,
    contenido: input.contenido,
    vehiculo_id: input.vehiculoId ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  const { error: updateError } = await supabase
    .from("mensajeria_conversaciones")
    .update({
      last_message: input.contenido.slice(0, 180),
      last_message_at: new Date().toISOString(),
      unread_count: input.unread ? 1 : 0,
    })
    .eq("id", input.conversationId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidateInbox();
  return { error: null as string | null };
}

export async function sendInboxMessage(
  _prev: MessagingActionState | null,
  formData: FormData,
): Promise<MessagingActionState> {
  await requireAdmin();
  const conversationId = requiredText(formData, "conversationId");
  const contenido = requiredText(formData, "contenido");
  const mode = requiredText(formData, "mode") || "texto";

  if (!isUuid(conversationId)) {
    return { error: "Conversación inválida." };
  }
  if (!contenido) {
    return { error: "Escribe un mensaje." };
  }

  const autor: MessageAuthor = mode === "nota" ? "interno" : "agente";
  const canal = mode === "nota" ? "interno" : "whatsapp";
  const result = await appendMessage({
    conversationId,
    autor,
    canal,
    contenido,
  });

  return result.error
    ? { error: result.error }
    : { error: null, success: mode === "nota" ? "Nota interna guardada." : "Mensaje enviado." };
}

export async function attachVehicleFicha(
  _prev: MessagingActionState | null,
  formData: FormData,
): Promise<MessagingActionState> {
  await requireAdmin();
  const conversationId = requiredText(formData, "conversationId");
  const vehicleId = requiredText(formData, "vehiculoId");
  if (!isUuid(conversationId) || !isUuid(vehicleId)) {
    return { error: "Selecciona un vehículo válido." };
  }

  const { vehicles, error } = await getValcronVehicles();
  if (error) {
    return { error };
  }
  const vehicle = vehicles.find((row) => row.id === vehicleId);
  if (!vehicle) {
    return { error: "Ese vehículo no está en el inventario." };
  }

  const result = await appendMessage({
    conversationId,
    autor: "agente",
    canal: "whatsapp",
    contenido: vehicleFichaText(vehicle),
    vehiculoId: vehicle.id,
  });

  return result.error
    ? { error: result.error }
    : { error: null, success: "Ficha de vehículo adjunta al chat." };
}

export async function generateIaReply(
  _prev: MessagingActionState | null,
  formData: FormData,
): Promise<MessagingActionState> {
  await requireAdmin();
  const conversationId = requiredText(formData, "conversationId");
  if (!isUuid(conversationId)) {
    return { error: "Conversación inválida." };
  }

  const supabase = await createClient();
  const { data: conversation, error } = await supabase
    .from("mensajeria_conversaciones")
    .select("id, prospecto_id, canal, ia_pilot")
    .eq("id", conversationId)
    .single();

  if (error || !conversation) {
    return { error: error?.message ?? "Conversación no encontrada." };
  }

  const [{ prospectos }, { vehicles }, messages] = await Promise.all([
    getValcronProspectos(),
    getValcronVehicles(),
    listInboxMessages(conversationId),
  ]);
  const lead = prospectos.find((row) => row.id === conversation.prospecto_id);
  const lastClient = [...messages.messages]
    .reverse()
    .find((row) => row.autor === "cliente");
  const vehiculo = lead?.vehiculo
    ? `${lead.vehiculo.marca} ${lead.vehiculo.modelo} ${lead.vehiculo.ano}`
    : null;
  const reply = draftIaReply({
    nombre: lead?.nombre ?? "cliente",
    pregunta: lastClient?.contenido,
    vehiculo,
    stock: vehicles,
  });

  const result = await appendMessage({
    conversationId,
    autor: "ia",
    canal: isMessageChannel(conversation.canal) ? conversation.canal : "whatsapp",
    contenido: reply,
  });

  return result.error
    ? { error: result.error }
    : { error: null, success: "Respuesta del Asesor IA enviada." };
}

export async function setIaPilot(
  _prev: MessagingActionState | null,
  formData: FormData,
): Promise<MessagingActionState> {
  await requireAdmin();
  const conversationId = requiredText(formData, "conversationId");
  const enabled = requiredText(formData, "enabled") === "1";
  if (!isUuid(conversationId)) {
    return { error: "Conversación inválida." };
  }

  const supabase = await createClient();
  const nextStatus: InboxStatus = enabled ? "ia" : "humano";
  const { error } = await supabase
    .from("mensajeria_conversaciones")
    .update({ ia_pilot: enabled, status: nextStatus })
    .eq("id", conversationId);

  if (error) {
    return { error: error.message };
  }

  revalidateInbox();
  return {
    error: null,
    success: enabled
      ? "IA Pilot activado. Las respuestas automáticas están en este hilo."
      : "IA Pilot desactivado. El hilo quedó en un asesor humano.",
  };
}

export async function assignConversation(
  _prev: MessagingActionState | null,
  formData: FormData,
): Promise<MessagingActionState> {
  await requireAdmin();
  const conversationId = requiredText(formData, "conversationId");
  const staffId = requiredText(formData, "staffId");
  const staffName = requiredText(formData, "staffName");
  if (!isUuid(conversationId) || !isUuid(staffId) || !staffName) {
    return { error: "Selecciona un vendedor." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mensajeria_conversaciones")
    .update({
      asignado_a: staffId,
      asignado_nombre: staffName,
      ia_pilot: false,
      status: "humano",
    })
    .eq("id", conversationId);

  if (error) {
    return { error: error.message };
  }

  await appendMessage({
    conversationId,
    autor: "interno",
    canal: "interno",
    contenido: `Conversación asignada a ${staffName}. IA Pilot desactivado.`,
  });

  return { error: null, success: `Asignado a ${staffName}.` };
}
