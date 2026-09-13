import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PUBLIC_PART_SELECT,
  PUBLIC_VEHICLE_SELECT,
  isPublicVehicleListing,
  isVinQuery,
  toPublicPart,
  toPublicVehicle,
  type PublicPart,
  type PublicPartRow,
  type PublicVehicle,
  type PublicVehicleRow,
} from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/server";

export async function loadPublicVehicles(): Promise<{
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

  return {
    data: ((data ?? []) as PublicVehicleRow[])
      .filter(isPublicVehicleListing)
      .map(toPublicVehicle),
    error: null,
  };
}

export async function loadPublicParts(query = ""): Promise<{
  data: PublicPart[];
  error: string | null;
  vinSearch: string | null;
}> {
  const search = query.trim();
  if (isVinQuery(search)) {
    return { data: [], error: null, vinSearch: search.toUpperCase() };
  }

  const partsDirect = COMPANIES.find((company) => company.inventario === "repuestos");
  if (!partsDirect) {
    return { data: [], error: "No se encontró el inventario de repuestos.", vinSearch: null };
  }

  const empresa = await getEmpresaIdByCompany(partsDirect);
  if (!empresa.id) {
    return {
      data: [],
      error: empresa.error ?? "No se encontró la empresa de repuestos.",
      vinSearch: null,
    };
  }

  const supabase = await createClient();
  let partsQuery = supabase
    .from("repuestos")
    .select(PUBLIC_PART_SELECT)
    .eq("empresa_id", empresa.id)
    .order("nombre", { ascending: true })
    .limit(48);

  if (search) {
    const safeSearch = search.replace(/[%_,()]/g, "").slice(0, 80);
    if (safeSearch) {
      partsQuery = partsQuery.or(
        `codigo_pieza.ilike.%${safeSearch}%,nombre.ilike.%${safeSearch}%`,
      );
    }
  }

  const { data, error } = await partsQuery;
  if (error) {
    return { data: [], error: error.message, vinSearch: null };
  }

  return {
    data: ((data ?? []) as PublicPartRow[]).map(toPublicPart),
    error: null,
    vinSearch: null,
  };
}
