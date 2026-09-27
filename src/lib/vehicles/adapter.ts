import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  PUBLIC_COVER_PHOTO_SELECT,
  PUBLIC_VEHICLE_LIST_SELECT,
  PUBLIC_VEHICLE_SELECT,
  normalizeVehicle,
} from "@/lib/vehicles/normalizeVehicle";
import {
  availabilityCounts,
  DEFAULT_PAGE_SIZE,
  matchesVehicleQuery,
  paginateVehicles,
  selectFeaturedVehicles,
  similarVehicles,
  sortVehicles,
} from "@/lib/vehicles/filters";
import { PUBLIC_INVENTORY_CACHE_TAG, PUBLIC_INVENTORY_REVALIDATE_SECONDS } from "@/lib/public-cache";
import { isMissingPublicPriceModeColumn, vehicleSelectWithoutPublicPriceMode } from "@/lib/public-price-mode";
import { isPublicCatalogListing, isPublicDetailListing } from "@/lib/website-schema";
import { buildVehicleSlug, isVehicleUuid, matchesVehicleSlug } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle, VehicleListResult, VehicleQuery } from "@/types/vehicle";
import type { VehiclePhotoRow, VehicleRow } from "@/lib/website-schema";
import { createAnonClient } from "@/utils/supabase/anon";

const CATALOG_STATUSES = ["available", "reserved"] as const;
const DETAIL_STATUSES = ["available", "reserved", "sold"] as const;

function asVehicleRows(data: unknown) {
  return (data ?? []) as unknown as VehicleRow[];
}

async function attachCoverPhotos(rows: VehicleRow[]): Promise<VehicleRow[]> {
  if (rows.length === 0) {
    return rows;
  }

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("vehicle_photos")
    .select(PUBLIC_COVER_PHOTO_SELECT)
    .in(
      "vehicle_id",
      rows.map((row) => row.id),
    )
    .eq("is_cover", true);

  if (error) {
    console.error("public cover photo load failed", error.message);
    return rows.map((row) => ({ ...row, vehicle_photos: row.vehicle_photos ?? [] }));
  }

  const covers = new Map<string, VehiclePhotoRow[]>();
  for (const photo of (data ?? []) as VehiclePhotoRow[]) {
    const current = covers.get(photo.vehicle_id) ?? [];
    current.push(photo);
    covers.set(photo.vehicle_id, current);
  }

  return rows.map((row) => ({
    ...row,
    vehicle_photos: covers.get(row.id) ?? [],
  }));
}

async function loadCatalogRows(): Promise<{ data: PublicVehicle[]; error: string | null }> {
  const supabase = createAnonClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_LIST_SELECT)
    .eq("published", true)
    .in("status", [...CATALOG_STATUSES])
    .order("updated_at", { ascending: false });
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(PUBLIC_VEHICLE_LIST_SELECT))
      .eq("published", true)
      .in("status", [...CATALOG_STATUSES])
      .order("updated_at", { ascending: false }));
  }

  if (error) {
    console.error("public inventory load failed", error.message);
    return { data: [], error: "No pudimos cargar el inventario en este momento." };
  }

  const withCovers = await attachCoverPhotos(asVehicleRows(data));
  return {
    data: withCovers.filter(isPublicCatalogListing).map(normalizeVehicle),
    error: null,
  };
}

const getCachedCatalogVehicles = unstable_cache(
  loadCatalogRows,
  ["public-catalog-vehicles"],
  { revalidate: PUBLIC_INVENTORY_REVALIDATE_SECONDS, tags: [PUBLIC_INVENTORY_CACHE_TAG] },
);

export const getAllPublicVehicles = cache(async () => getCachedCatalogVehicles());

function emptyFacets(): VehicleListResult["facets"] {
  return { makes: [], models: [], years: [], sources: [], availability: {} };
}

export async function getPublicVehicles(query: VehicleQuery = {}): Promise<VehicleListResult> {
  const loaded = query.includeSold
    ? await loadDetailIndex()
    : await getAllPublicVehicles();
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
  const loaded = await getAllPublicVehicles();
  return {
    data: selectFeaturedVehicles(loaded.data, limit),
    error: loaded.error,
  };
}

async function loadVehicleRowById(id: string) {
  const supabase = createAnonClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(PUBLIC_VEHICLE_SELECT))
      .eq("id", id)
      .maybeSingle());
  }

  if (error) {
    console.error("public vehicle detail load failed", error.message);
    return { data: null, error: "No pudimos cargar el inventario en este momento." };
  }

  const row = (data ?? null) as unknown as VehicleRow | null;
  if (!row || !isPublicDetailListing(row)) {
    return { data: null, error: null };
  }

  return { data: normalizeVehicle(row), error: null };
}

async function loadDetailIndex(): Promise<{ data: PublicVehicle[]; error: string | null }> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, year, make, model, trim, status, published, published_at, updated_at")
    .eq("published", true)
    .in("status", [...DETAIL_STATUSES]);

  if (error) {
    console.error("public vehicle index load failed", error.message);
    return { data: [], error: "No pudimos cargar el inventario en este momento." };
  }

  return {
    data: asVehicleRows(data)
      .filter(isPublicDetailListing)
      .map(normalizeVehicle),
    error: null,
  };
}

export async function getPublicVehicleBySlug(slug: string): Promise<{
  data: PublicVehicle | null;
  error: string | null;
}> {
  const value = slug.trim();
  if (!value) {
    return { data: null, error: null };
  }

  if (isVehicleUuid(value)) {
    return loadVehicleRowById(value);
  }

  const index = await loadDetailIndex();
  if (index.error) {
    return { data: null, error: index.error };
  }

  const match = index.data.find(
    (vehicle) => vehicle.slug === value || matchesVehicleSlug(value, vehicle.id),
  );
  if (!match) {
    return { data: null, error: null };
  }

  return loadVehicleRowById(match.id);
}

export async function getSimilarVehicles(vehicle: PublicVehicle, limit = 4) {
  const supabase = createAnonClient();
  let { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_LIST_SELECT)
    .eq("published", true)
    .in("status", [...CATALOG_STATUSES])
    .neq("id", vehicle.id)
    .order("updated_at", { ascending: false })
    .limit(24);
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(PUBLIC_VEHICLE_LIST_SELECT))
      .eq("published", true)
      .in("status", [...CATALOG_STATUSES])
      .neq("id", vehicle.id)
      .order("updated_at", { ascending: false })
      .limit(24));
  }

  if (error) {
    console.error("public similar vehicles load failed", error.message);
    return { data: [], error: "No pudimos cargar el inventario en este momento." };
  }

  const withCovers = await attachCoverPhotos(
    asVehicleRows(data).filter((row) => isPublicCatalogListing(row)),
  );
  return {
    data: similarVehicles(vehicle, withCovers.map(normalizeVehicle), limit),
    error: null,
  };
}

export async function getPublicSitemapVehicles() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, year, make, model, trim, status, published, published_at, updated_at")
    .eq("published", true)
    .in("status", [...DETAIL_STATUSES]);

  if (error) {
    console.error("public sitemap load failed", error.message);
    return { data: [] as PublicVehicle[], error: "No pudimos cargar el inventario en este momento." };
  }

  return {
    data: asVehicleRows(data)
      .filter(isPublicDetailListing)
      .map((row) => {
        const vehicle = normalizeVehicle(row);
        return {
          ...vehicle,
          slug: buildVehicleSlug({
            id: row.id,
            year: row.year,
            make: row.make,
            model: row.model,
            trim: row.trim,
          }),
        };
      }),
    error: null,
  };
}

export { getPublicSitemapVehicles as getPublicDetailVehicles };
