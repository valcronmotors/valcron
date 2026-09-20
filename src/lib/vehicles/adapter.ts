import { COMPANIES } from "@/lib/companies";
import { getEmpresaIdByCompany } from "@/lib/empresas";
import { PUBLIC_VEHICLE_SELECT, normalizeVehicle } from "@/lib/vehicles/normalizeVehicle";
import {
  availabilityCounts,
  DEFAULT_PAGE_SIZE,
  matchesVehicleQuery,
  paginateVehicles,
  selectFeaturedVehicles,
  similarVehicles,
  sortVehicles,
} from "@/lib/vehicles/filters";
import { isPublicCatalogListing, isPublicDetailListing } from "@/lib/vehicles/vehicle-status";
import { isVehicleUuid, matchesVehicleSlug } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle, PublicVehicleRow, VehicleListResult, VehicleQuery } from "@/types/vehicle";
import { createClient } from "@/utils/supabase/server";

async function valcronEmpresaId() {
  const valcron = COMPANIES.find((company) => company.inventario === "vehiculos");
  if (!valcron) {
    return { id: null as string | null, error: "No se encontró Valcron Motors Group SRL." };
  }
  const empresa = await getEmpresaIdByCompany(valcron);
  if (!empresa.id) {
    return { id: null as string | null, error: empresa.error ?? "No se encontró la empresa pública." };
  }
  return { id: empresa.id, error: null as string | null };
}

async function loadNormalized(options?: { includeSold?: boolean }): Promise<{
  data: PublicVehicle[];
  error: string | null;
}> {
  const empresa = await valcronEmpresaId();
  if (!empresa.id) {
    return { data: [], error: empresa.error };
  }

  const states = options?.includeSold
    ? ["Disponible", "En Subasta", "En Tránsito", "Vendido"]
    : ["Disponible", "En Subasta", "En Tránsito"];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select(PUBLIC_VEHICLE_SELECT)
    .eq("empresa_id", empresa.id)
    .in("estado", states)
    .order("ano", { ascending: false });

  if (error) {
    return { data: [], error: "No pudimos cargar el inventario en este momento." };
  }

  const rows = (data ?? []) as PublicVehicleRow[];
  const vehicles = rows
    .filter((row) => (options?.includeSold ? isPublicDetailListing(row) : isPublicCatalogListing(row)))
    .map(normalizeVehicle);

  return { data: vehicles, error: null };
}

function emptyFacets(): VehicleListResult["facets"] {
  return { makes: [], models: [], years: [], sources: [], availability: {} };
}

export async function getPublicVehicles(query: VehicleQuery = {}): Promise<VehicleListResult> {
  const loaded = await loadNormalized({ includeSold: query.includeSold });
  if (loaded.error) {
    return {
      data: [],
      pagination: { page: 1, limit: query.limit ?? DEFAULT_PAGE_SIZE, total: 0, totalPages: 1 },
      facets: emptyFacets(),
      error: loaded.error,
    };
  }

  const matched = loaded.data.filter((vehicle) => matchesVehicleQuery(vehicle, query));
  const sorted = sortVehicles(matched, query.sort ?? "recent");
  const paged = paginateVehicles(sorted, query.page ?? 1, query.limit ?? DEFAULT_PAGE_SIZE);
  const makes = [...new Set(loaded.data.map((vehicle) => vehicle.make).filter(Boolean))].sort();
  const models = [
    ...new Set(
      loaded.data
        .filter((vehicle) => !query.make || vehicle.make === query.make)
        .map((vehicle) => vehicle.model)
        .filter(Boolean),
    ),
  ].sort();
  const years = [...new Set(loaded.data.map((vehicle) => vehicle.year))].sort((a, b) => b - a);
  const sources = [...new Set(loaded.data.map((vehicle) => vehicle.source))];

  return {
    data: paged.data,
    pagination: paged.pagination,
    facets: {
      makes,
      models,
      years,
      sources,
      availability: availabilityCounts(loaded.data),
    },
    error: null,
  };
}

export async function getFeaturedVehicles(limit = 4) {
  const loaded = await loadNormalized();
  return {
    data: selectFeaturedVehicles(loaded.data, limit),
    error: loaded.error,
  };
}

export async function getPublicVehicleBySlug(slug: string): Promise<{
  data: PublicVehicle | null;
  error: string | null;
}> {
  const loaded = await loadNormalized({ includeSold: true });
  if (loaded.error) {
    return { data: null, error: loaded.error };
  }
  const value = slug.trim();
  const match = loaded.data.find((vehicle) =>
    isVehicleUuid(value) ? vehicle.id === value : vehicle.slug === value || matchesVehicleSlug(value, vehicle.id),
  );
  return { data: match ?? null, error: null };
}

export async function getSimilarVehicles(vehicle: PublicVehicle, limit = 4) {
  const loaded = await loadNormalized();
  if (loaded.error) {
    return { data: [], error: loaded.error };
  }
  return { data: similarVehicles(vehicle, loaded.data, limit), error: null };
}

export { loadNormalized as getAllPublicVehicles };
