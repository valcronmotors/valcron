"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { COMPANIES } from "@/lib/companies";
import {
  DEFAULT_CRM_STATE,
  DEFAULT_LEAD_ORIGIN,
  PROSPECTO_SELECT,
  isCrmActivityType,
  isCrmState,
  isLeadOrigin,
  normalizeProspecto,
  parseCotizacionItems,
  type CotizacionItem,
  type CotizacionRow,
  type CrmActividad,
  type ProspectoRow,
} from "@/lib/crm";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import { quoteTotals, roundMoney, safeTasa } from "@/lib/quotes";
import { createClient } from "@/utils/supabase/server";

export type CrmActionState = {
  error: string | null;
  record?: ProspectoRow | null;
};

export type ActivityActionState = {
  error: string | null;
  record?: CrmActividad | null;
};

export type QuoteActionState = {
  error: string | null;
  record?: CotizacionRow | null;
};

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = requiredText(formData, key);
  return value || null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function quotePrefix(companyName: string | null | undefined) {
  return (companyName ?? "").toLowerCase().includes("108") ? "108" : "VMG";
}

function quoteNumber(prefix: string, sequence: number) {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `COT-${prefix}-${stamp}-${String(sequence).padStart(4, "0")}`;
}

function normalizeQuote(row: {
  id: string;
  prospecto_id: string;
  empresa_id: string;
  numero_cotizacion: string;
  tasa_cambio: number | string;
  items: unknown;
  subtotal_usd: number | string | null;
  monto_total_usd: number | string;
  monto_total_dop: number | string;
  notas: string | null;
  created_at: string;
}): CotizacionRow {
  return {
    id: row.id,
    prospecto_id: row.prospecto_id,
    empresa_id: row.empresa_id,
    numero: row.numero_cotizacion,
    tasa_usd_dop: Number(row.tasa_cambio),
    items: parseCotizacionItems(row.items),
    subtotal_usd: Number(row.subtotal_usd ?? 0),
    total_usd: Number(row.monto_total_usd),
    total_dop: Number(row.monto_total_dop),
    notas: row.notas,
    created_at: row.created_at,
  };
}

export async function createProspecto(
  _prev: CrmActionState | null,
  formData: FormData,
): Promise<CrmActionState> {
  await requireAdmin();
  const nombre = requiredText(formData, "nombre");
  const telefono = optionalText(formData, "telefono");
  const email = optionalText(formData, "email");
  const origenLead = requiredText(formData, "origen_lead") || DEFAULT_LEAD_ORIGIN;
  const estadoCrm = requiredText(formData, "estado_crm") || DEFAULT_CRM_STATE;
  const notas = optionalText(formData, "notas");
  const vehiculoId = requiredText(formData, "vehiculo_interes_id");
  const repuestoId = requiredText(formData, "repuesto_interes_id");
  const companySlug = requiredText(formData, "empresa_slug");

  if (!nombre) {
    return { error: "El nombre del prospecto es obligatorio." };
  }
  if (!isLeadOrigin(origenLead)) {
    return { error: "Selecciona un origen de lead válido." };
  }
  if (!isCrmState(estadoCrm)) {
    return { error: "Selecciona un estado CRM válido." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El correo electrónico no es válido." };
  }

  const company = COMPANIES.find((item) => item.slug === companySlug);
  if (!company) {
    return { error: "Selecciona la empresa del lead." };
  }

  const supabase = await createClient();
  let empresaId: string | null = null;
  let vehiculoInteresId: string | null = null;
  let repuestoInteresId: string | null = null;

  if (company.inventario === "vehiculos" && isUuid(vehiculoId)) {
    const { data, error } = await supabase
      .from("vehiculos")
      .select("id, empresa_id, estado")
      .eq("id", vehiculoId)
      .maybeSingle();
    if (error || !data) {
      return { error: "El vehículo seleccionado no está disponible." };
    }
    if (data.estado === "Vendido") {
      return { error: "Ese vehículo ya está vendido. Elige uno activo." };
    }
    vehiculoInteresId = data.id;
    empresaId = data.empresa_id;
  }

  if (company.inventario === "repuestos" && isUuid(repuestoId)) {
    const { data, error } = await supabase
      .from("repuestos")
      .select("id, empresa_id, cantidad")
      .eq("id", repuestoId)
      .maybeSingle();
    if (error || !data) {
      return { error: "El repuesto seleccionado no está disponible." };
    }
    if (Number(data.cantidad ?? 0) <= 0) {
      return { error: "Ese repuesto no tiene existencia. Elige uno activo." };
    }
    repuestoInteresId = data.id;
    empresaId = data.empresa_id;
  }

  if (!empresaId) {
    const resolved = await getEmpresaIdByCompany(company);
    if (!resolved.id) {
      return { error: resolved.error ?? "No se encontró la empresa del lead." };
    }
    empresaId = resolved.id;
  }

  const { data, error } = await supabase
    .from("prospectos")
    .insert({
      empresa_id: empresaId,
      nombre,
      telefono,
      email,
      vehiculo_interes_id: vehiculoInteresId,
      repuesto_interes_id: repuestoInteresId,
      origen_lead: origenLead,
      estado_crm: estadoCrm,
      notas,
    })
    .select(PROSPECTO_SELECT)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/crm");
  revalidatePath("/");
  revalidatePath("/admin");
  return { error: null, record: normalizeProspecto(data) };
}

export async function updateProspectoEstado(
  id: string,
  estadoCrm: string,
): Promise<CrmActionState> {
  await requireAdmin();
  if (!isUuid(id)) {
    return { error: "El prospecto no es válido." };
  }
  if (!isCrmState(estadoCrm)) {
    return { error: "Selecciona un estado CRM válido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospectos")
    .update({
      estado_crm: estadoCrm,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(PROSPECTO_SELECT)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/crm");
  return { error: null, record: normalizeProspecto(data) };
}

export async function updateProspectoInteres(
  id: string,
  vehiculoId: string | null,
  repuestoId: string | null,
): Promise<CrmActionState> {
  await requireAdmin();
  if (!isUuid(id)) {
    return { error: "El prospecto no es válido." };
  }
  if (vehiculoId && repuestoId) {
    return { error: "El prospecto no puede vincular vehículo y repuesto a la vez." };
  }

  const supabase = await createClient();
  const nextVehicle = vehiculoId && isUuid(vehiculoId) ? vehiculoId : null;
  const nextPart = repuestoId && isUuid(repuestoId) ? repuestoId : null;

  if (nextVehicle) {
    const { data, error } = await supabase
      .from("vehiculos")
      .select("id, estado")
      .eq("id", nextVehicle)
      .maybeSingle();
    if (error || !data) {
      return { error: "El vehículo seleccionado no está disponible." };
    }
    if (data.estado === "Vendido") {
      return { error: "Ese vehículo ya está vendido. Elige uno activo." };
    }
  }

  if (nextPart) {
    const { data, error } = await supabase
      .from("repuestos")
      .select("id, cantidad")
      .eq("id", nextPart)
      .maybeSingle();
    if (error || !data) {
      return { error: "El repuesto seleccionado no está disponible." };
    }
    if (Number(data.cantidad ?? 0) <= 0) {
      return { error: "Ese repuesto no tiene existencia. Elige uno activo." };
    }
  }

  const { data, error } = await supabase
    .from("prospectos")
    .update({
      vehiculo_interes_id: nextVehicle,
      repuesto_interes_id: nextPart,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(PROSPECTO_SELECT)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/crm");
  return { error: null, record: normalizeProspecto(data) };
}

export async function listActividades(prospectoId: string) {
  await requireAdmin();
  if (!isUuid(prospectoId)) {
    return { error: "El prospecto no es válido.", data: [] as CrmActividad[] };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_actividades")
    .select("id, prospecto_id, tipo, descripcion, programada_para, audio_url, created_at")
    .eq("prospecto_id", prospectoId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: [] as CrmActividad[] };
  }

  return { error: null, data: (data ?? []) as CrmActividad[] };
}

export async function createActividad(
  formData: FormData,
): Promise<ActivityActionState> {
  await requireAdmin();
  const prospectoId = requiredText(formData, "prospecto_id");
  const tipo = requiredText(formData, "tipo");
  const descripcion = optionalText(formData, "descripcion");
  const programadaPara = optionalText(formData, "programada_para");
  const audioUrl = optionalText(formData, "audio_url");

  if (!isUuid(prospectoId)) {
    return { error: "El prospecto no es válido." };
  }
  if (!isCrmActivityType(tipo)) {
    return { error: "Selecciona un tipo de actividad válido." };
  }
  if (tipo === "Recordatorio" && !programadaPara) {
    return { error: "Indica fecha y hora del recordatorio." };
  }
  if (tipo === "Nota de voz" && !audioUrl) {
    return { error: "Graba o sube una nota de voz antes de guardar." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_actividades")
    .insert({
      prospecto_id: prospectoId,
      tipo,
      descripcion,
      programada_para: programadaPara,
      audio_url: audioUrl,
    })
    .select("id, prospecto_id, tipo, descripcion, programada_para, audio_url, created_at")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/crm");
  return { error: null, record: data as CrmActividad };
}

export async function listCotizaciones(prospectoId: string) {
  await requireAdmin();
  if (!isUuid(prospectoId)) {
    return { error: "El prospecto no es válido.", data: [] as CotizacionRow[] };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(
      "id, prospecto_id, empresa_id, numero_cotizacion, tasa_cambio, items, subtotal_usd, monto_total_usd, monto_total_dop, notas, created_at",
    )
    .eq("prospecto_id", prospectoId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: [] as CotizacionRow[] };
  }

  return {
    error: null,
    data: (data ?? []).map(normalizeQuote),
  };
}

export async function createCotizacion(input: {
  prospectoId: string;
  tasaUsdDop: number;
  items: CotizacionItem[];
  notas: string | null;
}): Promise<QuoteActionState> {
  await requireAdmin();
  if (!isUuid(input.prospectoId)) {
    return { error: "El prospecto no es válido." };
  }

  const items = input.items
    .map((item) => ({
      descripcion: item.descripcion.trim(),
      cantidad: Math.max(1, roundMoney(item.cantidad)),
      precio_unitario_usd: roundMoney(item.precio_unitario_usd),
      precio_unitario_dop: roundMoney(item.precio_unitario_dop),
    }))
    .filter((item) => item.descripcion.length > 0);

  if (items.length === 0) {
    return { error: "Agrega al menos un ítem con descripción a la cotización." };
  }

  const tasa = safeTasa(input.tasaUsdDop);
  const totals = quoteTotals(items);
  const supabase = await createClient();
  const { data: prospecto, error: prospectoError } = await supabase
    .from("prospectos")
    .select("id, empresa_id, empresa:empresas!empresa_id (id, nombre)")
    .eq("id", input.prospectoId)
    .maybeSingle();

  if (prospectoError || !prospecto) {
    return { error: "No se encontró el prospecto para cotizar." };
  }

  const empresa = Array.isArray(prospecto.empresa)
    ? prospecto.empresa[0]
    : prospecto.empresa;
  const { count } = await supabase
    .from("cotizaciones")
    .select("id", { count: "exact", head: true })
    .eq("empresa_id", prospecto.empresa_id);

  const numero = quoteNumber(quotePrefix(empresa?.nombre), (count ?? 0) + 1);
  const validaHasta = new Date();
  validaHasta.setDate(validaHasta.getDate() + 15);
  const { data, error } = await supabase
    .from("cotizaciones")
    .insert({
      prospecto_id: input.prospectoId,
      empresa_id: prospecto.empresa_id,
      numero_cotizacion: numero,
      tasa_cambio: tasa,
      items,
      subtotal_usd: totals.subtotalUsd,
      monto_total_usd: totals.totalUsd,
      monto_total_dop: totals.totalDop,
      notas: input.notas,
      valida_hasta: validaHasta.toISOString().slice(0, 10),
    })
    .select(
      "id, prospecto_id, empresa_id, numero_cotizacion, tasa_cambio, items, subtotal_usd, monto_total_usd, monto_total_dop, notas, created_at",
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/crm");
  return { error: null, record: normalizeQuote(data) };
}
