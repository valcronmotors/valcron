import { COMPANIES } from "@/lib/companies";
import { DEFAULT_CRM_STATE } from "@/lib/crm";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PUBLIC_PART_SELECT,
  PUBLIC_VEHICLE_SELECT,
  publicJson,
  publicOptions,
  vehicleInterestMessage,
  type PublicPartRow,
  type PublicVehicleRow,
  isVinQuery,
} from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return publicJson(request, { error: "No se pudo leer la solicitud." }, 400);
  }

  const nombre = String(body.nombre ?? "").trim();
  const telefono = String(body.telefono ?? "").trim() || null;
  const email = String(body.email ?? "").trim() || null;
  const mensaje = String(body.mensaje ?? "").trim() || null;
  const vehiculoId = String(body.vehiculoId ?? body.vehiculo_id ?? "").trim();
  const vin = String(body.vin ?? "").trim().toUpperCase();
  const codigoPieza = String(body.codigoPieza ?? body.codigo_pieza ?? "").trim();

  if (!nombre) {
    return publicJson(request, { error: "El nombre es obligatorio." }, 400);
  }
  if (nombre.length > 120) {
    return publicJson(request, { error: "El nombre es demasiado largo." }, 400);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return publicJson(request, { error: "El correo electrónico no es válido." }, 400);
  }

  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos");
  const partsDirect = COMPANIES.find((company) => company.inventario === "repuestos");
  if (!valcron || !partsDirect) {
    return publicJson(request, { error: "No se encontraron las empresas públicas." }, 500);
  }

  const [valcronEmpresa, partsEmpresa] = await Promise.all([
    getEmpresaIdByCompany(valcron),
    getEmpresaIdByCompany(partsDirect),
  ]);
  if (!valcronEmpresa.id) {
    return publicJson(
      request,
      { error: valcronEmpresa.error ?? "No se encontró la empresa pública." },
      500,
    );
  }

  const supabase = await createClient();
  let vehicle: (PublicVehicleRow & { empresa_id: string; estado: string }) | null = null;
  let part: PublicPartRow | null = null;

  if (UUID_PATTERN.test(vehiculoId) || isVinQuery(vin)) {
    let vehicleQuery = supabase
      .from("vehiculos")
      .select(`${PUBLIC_VEHICLE_SELECT}, empresa_id, estado`)
      .eq("empresa_id", valcronEmpresa.id);

    if (UUID_PATTERN.test(vehiculoId)) {
      vehicleQuery = vehicleQuery.eq("id", vehiculoId);
    } else {
      vehicleQuery = vehicleQuery.eq("vin", vin);
    }

    const { data, error } = await vehicleQuery.maybeSingle();
    if (error) {
      return publicJson(request, { error: error.message }, 500);
    }
    if (data && data.estado === "Disponible") {
      vehicle = data as PublicVehicleRow & { empresa_id: string; estado: string };
    }
  }

  if (codigoPieza && partsEmpresa.id) {
    const { data, error } = await supabase
      .from("repuestos")
      .select(PUBLIC_PART_SELECT)
      .eq("empresa_id", partsEmpresa.id)
      .ilike("codigo_pieza", codigoPieza)
      .maybeSingle();

    if (error) {
      return publicJson(request, { error: error.message }, 500);
    }
    part = (data as PublicPartRow | null) ?? null;
  }

  const empresaId = vehicle || !part || !partsEmpresa.id ? valcronEmpresa.id : partsEmpresa.id;
  const notas = [
    mensaje,
    vehicle
      ? vehicleInterestMessage({
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          ano: vehicle.ano,
          vin: vehicle.vin,
        })
      : vin
        ? `VIN consultado: ${vin}`
        : null,
    part
      ? `Repuesto consultado: ${part.codigo_pieza} · ${part.nombre}`
      : codigoPieza
        ? `Código de pieza consultado: ${codigoPieza}`
        : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { data, error } = await supabase
    .from("prospectos")
    .insert({
      empresa_id: empresaId,
      nombre,
      telefono,
      email,
      vehiculo_interes_id: vehicle?.id ?? null,
      repuesto_interes_id: vehicle ? null : part?.id ?? null,
      origen_lead: "Web",
      estado_crm: DEFAULT_CRM_STATE,
      notas: notas || null,
    })
    .select("id")
    .single();

  if (error) {
    return publicJson(request, { error: error.message }, 500);
  }

  return publicJson(request, { data: { id: data.id } }, 201);
}
