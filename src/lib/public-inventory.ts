import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PUBLIC_VEHICLE_SELECT,
  isPublicVehicleListing,
  toPublicVehicle,
  type PublicVehicle,
  type PublicVehicleRow,
} from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/server";

export async function loadPublicVehicles(options?: { limit?: number }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos");
  if (!valcron) {
    return { data: [], error: "No se encontró Valcron Motors Group SRL." };
  }

  const empresa = await getEmpresaIdByCompany(valcron);
  if (!empresa.id) {
    return { data: [], error: empresa.error ?? "No se encontró la empresa pública." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select(PUBLIC_VEHICLE_SELECT)
    .eq("empresa_id", empresa.id)
    .in("estado", ["Disponible", "En Subasta"])
    .order("ano", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  const vehicles = ((data ?? []) as PublicVehicleRow[])
    .filter(isPublicVehicleListing)
    .map(toPublicVehicle);

  return {
    data: options?.limit ? vehicles.slice(0, options.limit) : vehicles,
    error: null,
  };
}

export async function loadPublicVehicleById(id: string): Promise<{
  data: PublicVehicle | null;
  error: string | null;
}> {
  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos");
  if (!valcron) {
    return { data: null, error: "No se encontró Valcron Motors Group SRL." };
  }

  const empresa = await getEmpresaIdByCompany(valcron);
  if (!empresa.id) {
    return { data: null, error: empresa.error ?? "No se encontró la empresa pública." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select(PUBLIC_VEHICLE_SELECT)
    .eq("empresa_id", empresa.id)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  const row = data as PublicVehicleRow;
  if (!isPublicVehicleListing(row)) {
    return { data: null, error: null };
  }

  return { data: toPublicVehicle(row), error: null };
}
