"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import type { PartRow, VehicleRow } from "@/lib/inventory";
import { isAuctionSource } from "@/lib/auction";
import { parseSaleChannels } from "@/lib/parts";
import { MAX_VEHICLE_PHOTOS } from "@/lib/storage";
import {
  DEFAULT_TASA_USD_DOP,
  calculateVehicleCosts,
  isVehicleState,
  parseAmount,
} from "@/lib/vehicle-costs";
import { createClient } from "@/utils/supabase/server";

export type ActionState<T = unknown> = {
  error: string | null;
  record?: T | null;
};

const VEHICLE_SELECT =
  "id, vin, marca, modelo, trim, ano, costo_subasta_usd, gastos_taller_usa_usd, gastos_grua_usd, gastos_titulacion_usd, fees_adicionales_usd, flete_usd, costo_total_usd, tasa_usd_dop, costo_taller_dop, impuestos_dga_dop, costo_total_dop, precio_venta_dop, estado, fotos_urls, ubicacion_lote, lote_numero, fuente_subasta";

const PART_SELECT =
  "id, codigo_pieza, nombre, cantidad, precio_costo, envio_usd, comisiones_usd, precio_venta, canales_venta";

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseVehiclePayload(formData: FormData) {
  const vin = requiredText(formData, "vin").toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  const marca = requiredText(formData, "marca");
  const modelo = requiredText(formData, "modelo");
  const trim = requiredText(formData, "trim");
  const ano = Number(formData.get("ano"));
  const estado = requiredText(formData, "estado") || "En Subasta";
  const costoSubastaUsd = parseAmount(formData.get("costo_subasta_usd"));
  const gastosTallerUsaUsd = parseAmount(formData.get("gastos_taller_usa_usd"));
  const gastosGruaUsd = parseAmount(formData.get("gastos_grua_usd"));
  const gastosTitulacionUsd = parseAmount(formData.get("gastos_titulacion_usd"));
  const feesAdicionalesUsd = parseAmount(formData.get("fees_adicionales_usd"));
  const fleteUsd = parseAmount(formData.get("flete_usd"));
  const tasaUsdDop =
    parseAmount(formData.get("tasa_usd_dop")) || DEFAULT_TASA_USD_DOP;
  const gastosTallerRdDop = parseAmount(formData.get("costo_taller_dop"));
  const impuestosDgaDop = parseAmount(formData.get("impuestos_dga_dop"));
  const precioVentaInput = requiredText(formData, "precio_venta_dop");
  const ubicacionLote = requiredText(formData, "ubicacion_lote");
  const loteNumero = requiredText(formData, "lote_numero");
  const fuenteSubasta = requiredText(formData, "fuente_subasta");
  const fotosUrls = parseFotoUrls(formData.get("fotos_urls"));

  if (!vin || vin.length !== 17) {
    return { error: "El VIN debe tener 17 caracteres." };
  }
  if (!marca || !modelo) {
    return { error: "Marca y modelo son obligatorios." };
  }
  if (!Number.isInteger(ano) || ano < 1980 || ano > new Date().getFullYear() + 1) {
    return { error: "El año del vehículo no es válido." };
  }
  if (!isVehicleState(estado)) {
    return { error: "Selecciona un estado válido." };
  }
  if (fuenteSubasta && !isAuctionSource(fuenteSubasta)) {
    return { error: "La fuente de subasta no es válida." };
  }

  const costs = calculateVehicleCosts({
    costoSubastaUsd,
    gastosTallerUsaUsd,
    gastosGruaUsd,
    gastosTitulacionUsd,
    feesAdicionalesUsd,
    fleteUsd,
    tasaUsdDop,
    gastosTallerRdDop,
    impuestosDgaDop,
  });

  return {
    error: null,
    row: {
      vin,
      marca,
      modelo,
      trim: trim || null,
      ano,
      costo_subasta_usd: costoSubastaUsd,
      gastos_taller_usa_usd: gastosTallerUsaUsd,
      gastos_grua_usd: gastosGruaUsd,
      gastos_titulacion_usd: gastosTitulacionUsd,
      fees_adicionales_usd: feesAdicionalesUsd,
      flete_usd: fleteUsd,
      costo_taller_dop: gastosTallerRdDop,
      impuestos_dga_dop: impuestosDgaDop,
      precio_venta_dop: precioVentaInput
        ? parseAmount(precioVentaInput)
        : costs.precioEstimadoDop,
      tasa_usd_dop: tasaUsdDop,
      costo_total_usd: costs.costoTotalUsd,
      costo_total_dop: costs.costoTotalDop,
      precio_estimado_dop: costs.precioEstimadoDop,
      estado,
      fotos_urls: fotosUrls,
      ubicacion_lote: ubicacionLote || null,
      lote_numero: loteNumero || null,
      fuente_subasta: fuenteSubasta || null,
    },
  };
}

function parseFotoUrls(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is string =>
          typeof item === "string" && /^https?:\/\//i.test(item),
      )
      .slice(0, MAX_VEHICLE_PHOTOS);
  } catch {
    return [];
  }
}

function parsePartPayload(formData: FormData) {
  const codigoPieza = requiredText(formData, "codigo_pieza").toUpperCase();
  const nombre = requiredText(formData, "nombre");
  const cantidad = Number(formData.get("cantidad"));
  const precioCosto = parseAmount(formData.get("precio_costo"));
  const envioUsd = parseAmount(formData.get("envio_usd"));
  const comisionesUsd = parseAmount(formData.get("comisiones_usd"));
  const precioVenta = parseAmount(formData.get("precio_venta"));
  const canalesVenta = parseSaleChannels(formData.getAll("canales_venta"));

  if (!codigoPieza) {
    return { error: "El código de pieza es obligatorio." };
  }
  if (!nombre) {
    return { error: "El nombre del repuesto es obligatorio." };
  }
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    return { error: "La cantidad debe ser un número entero válido." };
  }

  return {
    error: null,
    row: {
      codigo_pieza: codigoPieza,
      nombre,
      cantidad,
      precio_costo: precioCosto,
      envio_usd: envioUsd,
      comisiones_usd: comisionesUsd,
      precio_venta: precioVenta,
      canales_venta: canalesVenta,
    },
  };
}

async function resolveEmpresaId(inventario: "vehiculos" | "repuestos") {
  const company = COMPANIES.find((item) => item.inventario === inventario);
  if (!company) {
    return { id: null, error: "No está configurada la empresa." };
  }

  const { id, error } = await getEmpresaIdByCompany(company);
  if (error) {
    return { id: null, error };
  }
  if (!id) {
    return {
      id: null,
      error: `No se encontró ${company.nombre} en la tabla empresas.`,
    };
  }

  return { id, error: null };
}

function isModalSubmit(formData: FormData) {
  return requiredText(formData, "mode") === "modal";
}

export async function createVehiculo(
  _prev: ActionState<VehicleRow> | null,
  formData: FormData,
): Promise<ActionState<VehicleRow>> {
  await requireAdmin();
  const empresa = await resolveEmpresaId("vehiculos");
  if (!empresa.id) {
    return { error: empresa.error };
  }

  const parsed = parseVehiclePayload(formData);
  if (parsed.error || !parsed.row) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .insert({
      empresa_id: empresa.id,
      ...parsed.row,
    })
    .select(VEHICLE_SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Ese VIN ya está registrado." };
    }
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/vehiculos");
  revalidatePath(`/vehiculos/${data.id}`);

  if (isModalSubmit(formData)) {
    return { error: null, record: data as VehicleRow };
  }

  redirect("/vehiculos?creado=1");
}

export async function updateVehiculo(
  id: string,
  _prev: ActionState<VehicleRow> | null,
  formData: FormData,
): Promise<ActionState<VehicleRow>> {
  await requireAdmin();
  const parsed = parseVehiclePayload(formData);
  if (parsed.error || !parsed.row) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehiculos")
    .update(parsed.row)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Ese VIN ya está registrado." };
    }
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/vehiculos");
  revalidatePath(`/vehiculos/${id}`);
  revalidatePath(`/vehiculos/${id}/editar`);
  redirect("/vehiculos?actualizado=1");
}

export async function updateVehiclePhotos(
  id: string,
  urls: string[],
): Promise<ActionState<VehicleRow>> {
  await requireAdmin();
  const fotosUrls = urls
    .filter((item) => typeof item === "string" && /^https?:\/\//i.test(item))
    .slice(0, MAX_VEHICLE_PHOTOS);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .update({ fotos_urls: fotosUrls })
    .eq("id", id)
    .select(VEHICLE_SELECT)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/vehiculos");
  revalidatePath(`/vehiculos/${id}`);
  revalidatePath(`/vehiculos/${id}/editar`);
  return { error: null, record: data as VehicleRow };
}

export async function createRepuesto(
  _prev: ActionState<PartRow> | null,
  formData: FormData,
): Promise<ActionState<PartRow>> {
  await requireAdmin();
  const empresa = await resolveEmpresaId("repuestos");
  if (!empresa.id) {
    return { error: empresa.error };
  }

  const parsed = parsePartPayload(formData);
  if (parsed.error || !parsed.row) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repuestos")
    .insert({
      empresa_id: empresa.id,
      ...parsed.row,
    })
    .select(PART_SELECT)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/repuestos");

  if (isModalSubmit(formData)) {
    return { error: null, record: data as PartRow };
  }

  redirect("/repuestos?creado=1");
}

export async function updateRepuesto(
  id: string,
  _prev: ActionState<PartRow> | null,
  formData: FormData,
): Promise<ActionState<PartRow>> {
  await requireAdmin();
  const parsed = parsePartPayload(formData);
  if (parsed.error || !parsed.row) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("repuestos")
    .update(parsed.row)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/repuestos");
  revalidatePath(`/repuestos/${id}/editar`);
  redirect("/repuestos?actualizado=1");
}
