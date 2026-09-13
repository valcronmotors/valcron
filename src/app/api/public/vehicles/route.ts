import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import {
  PUBLIC_VEHICLE_SELECT,
  isPublicVehicleListing,
  publicJson,
  publicOptions,
  toPublicVehicle,
  type PublicVehicleRow,
} from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return publicOptions(request);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const marca = url.searchParams.get("marca")?.trim() ?? "";
  const listing = url.searchParams.get("listing")?.trim() ?? "";
  const search = (url.searchParams.get("q") ?? url.searchParams.get("vin") ?? "").trim();
  const ano = Number(url.searchParams.get("ano") ?? "");
  const anoMin = Number(url.searchParams.get("anoMin") ?? "");
  const anoMax = Number(url.searchParams.get("anoMax") ?? "");
  const precioMin = Number(url.searchParams.get("precioMin") ?? "");
  const precioMax = Number(url.searchParams.get("precioMax") ?? "");

  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos");
  if (!valcron) {
    return publicJson(request, { error: "No se encontró Valcron Motors Group SRL." }, 500);
  }

  const empresa = await getEmpresaIdByCompany(valcron);
  if (!empresa.id) {
    return publicJson(
      request,
      { error: empresa.error ?? "No se encontró la empresa pública." },
      500,
    );
  }

  const supabase = await createClient();
  let query = supabase
    .from("vehiculos")
    .select(PUBLIC_VEHICLE_SELECT)
    .eq("empresa_id", empresa.id)
    .in("estado", ["Disponible", "En Subasta"])
    .order("ano", { ascending: false });

  if (marca) {
    query = query.ilike("marca", marca);
  }
  if (Number.isFinite(ano) && ano > 0) {
    query = query.eq("ano", ano);
  }
  if (Number.isFinite(anoMin) && anoMin > 0) {
    query = query.gte("ano", anoMin);
  }
  if (Number.isFinite(anoMax) && anoMax > 0) {
    query = query.lte("ano", anoMax);
  }
  if (Number.isFinite(precioMin) && precioMin > 0) {
    query = query.gte("precio_venta_dop", precioMin);
  }
  if (Number.isFinite(precioMax) && precioMax > 0) {
    query = query.lte("precio_venta_dop", precioMax);
  }

  const { data, error } = await query;
  if (error) {
    return publicJson(request, { error: error.message }, 500);
  }

  const needle = search.toLowerCase();
  const vehicles = ((data ?? []) as PublicVehicleRow[])
    .filter(isPublicVehicleListing)
    .map(toPublicVehicle)
    .filter((vehicle) => {
      if (listing === "dealer" && vehicle.listingKind !== "dealer") {
        return false;
      }
      if ((listing === "auction" || listing === "subasta") && vehicle.listingKind !== "auction") {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [vehicle.marca, vehicle.modelo, vehicle.trim ?? "", vehicle.vin, String(vehicle.ano)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });

  return publicJson(request, { data: vehicles }, 200);
}
