"use server";

import { revalidatePath } from "next/cache";
import { publicActionError } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/auth";
import { emptyFacets } from "@/lib/auction-providers/copart/ingest";
import { fetchCopartLotImageUrls } from "@/lib/auction-providers/copart/lot-images";
import { copartFeedIsStale, copartFreshnessCopy } from "@/lib/auction-providers/copart/freshness";
import {
  COPART_DUPLICATE_LOT_MESSAGE,
  copartOpportunityInsert,
} from "@/lib/auction-providers/copart/opportunity";
import {
  COPART_LOOKUP_INVALID_LOT,
  COPART_LOT_NOT_FOUND_MESSAGE,
  copartPrefillFromVehicle,
  resolveCopartLotLookupInput,
} from "@/lib/auction-providers/copart/lookup";
import { normalizeCopartLotNumber } from "@/lib/auction-providers/copart/urls";
import {
  copartSearchQueryPlan,
  copartVehicleFromCache,
  type CopartCacheRecord,
} from "@/lib/auction-providers/copart/search";
import type { AuctionProviderFacets, AuctionProviderSearchFilters, AuctionSearchVehicle } from "@/lib/auction-providers/types";
import { createClient } from "@/utils/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function missingTable(error: { message?: string | null; code?: string | null } | null) {
  const message = (error?.message ?? "").toLowerCase();
  return error?.code === "42P01" || message.includes("copart_inventory_cache") || message.includes("does not exist");
}

export async function getCopartFeedMeta() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("copart_feed_snapshots")
    .select("id, status, imported_at, feed_last_updated, row_count, facets, source_filename")
    .eq("status", "active")
    .maybeSingle();

  if (error && missingTable(error)) {
    return {
      snapshot: null,
      freshness: copartFreshnessCopy(null),
      error: "El inventario Copart todavía no está migrado. Aplica la migración local e importa el CSV oficial.",
    };
  }

  if (error) {
    return {
      snapshot: null,
      freshness: copartFreshnessCopy(null),
      error: publicActionError(error, "No pudimos leer el inventario Copart."),
    };
  }

  const importedAt = data?.imported_at ?? null;
  return {
    snapshot: data
      ? {
          id: data.id as string,
          importedAt,
          feedLastUpdated: (data.feed_last_updated as string | null) ?? null,
          rowCount: Number(data.row_count ?? 0),
          facets: (data.facets as AuctionProviderFacets) ?? emptyFacets(),
          sourceFilename: (data.source_filename as string | null) ?? null,
          stale: copartFeedIsStale(importedAt),
        }
      : null,
    freshness: copartFreshnessCopy(importedAt),
    error: null as string | null,
  };
}

export async function searchCopartInventory(input: AuctionProviderSearchFilters) {
  await requireAdmin();
  const plan = copartSearchQueryPlan(input);
  const meta = await getCopartFeedMeta();
  if (!meta.snapshot) {
    return {
      items: [] as AuctionSearchVehicle[],
      total: 0,
      page: plan.filters.page,
      pageSize: plan.filters.pageSize,
      totalPages: 1,
      freshness: meta.freshness,
      facets: emptyFacets(),
      error: meta.error ?? "No hay un inventario Copart activo. Importa el CSV oficial.",
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("copart_inventory_cache")
    .select("*", { count: "exact" })
    .eq("snapshot_id", meta.snapshot.id);

  if (plan.exactLot) {
    query = query.eq("lot_number", plan.exactLot);
  } else if (plan.exactVin) {
    query = query.eq("vin", plan.exactVin);
  } else if (plan.filters.query) {
    query = query.ilike("search_text", `%${plan.filters.query.toLowerCase()}%`);
  }
  if (plan.filters.make) query = query.eq("make", plan.filters.make);
  if (plan.filters.model) query = query.ilike("model", `%${plan.filters.model}%`);
  if (plan.filters.yearMin != null) query = query.gte("year", plan.filters.yearMin);
  if (plan.filters.yearMax != null) query = query.lte("year", plan.filters.yearMax);
  if (plan.filters.locationState) query = query.eq("location_state", plan.filters.locationState);
  if (plan.filters.titleType) query = query.eq("title_type", plan.filters.titleType);
  if (plan.filters.primaryDamage) query = query.eq("primary_damage", plan.filters.primaryDamage);
  if (plan.filters.runCondition) query = query.eq("run_condition", plan.filters.runCondition);
  if (plan.filters.buyItNow === true) query = query.gt("buy_it_now_price", 0);
  if (plan.filters.buyItNow === false) query = query.or("buy_it_now_price.is.null,buy_it_now_price.eq.0");
  if (plan.filters.mileageMin != null) query = query.gte("mileage", plan.filters.mileageMin);
  if (plan.filters.mileageMax != null) query = query.lte("mileage", plan.filters.mileageMax);

  const { data, error, count } = await query
    .order("year", { ascending: false })
    .order("lot_number", { ascending: false })
    .range(plan.range.from, plan.range.to);

  if (error) {
    return {
      items: [] as AuctionSearchVehicle[],
      total: 0,
      page: plan.filters.page,
      pageSize: plan.filters.pageSize,
      totalPages: 1,
      freshness: meta.freshness,
      facets: meta.snapshot.facets,
      error: publicActionError(error, "No pudimos buscar el inventario Copart."),
    };
  }

  const total = count ?? 0;
  return {
    items: ((data ?? []) as CopartCacheRecord[]).map(copartVehicleFromCache),
    total,
    page: plan.filters.page,
    pageSize: plan.filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / plan.filters.pageSize)),
    freshness: meta.freshness,
    facets: meta.snapshot.facets,
    error: null as string | null,
  };
}

export async function getCopartLot(lotNumber: string) {
  await requireAdmin();
  const lot = normalizeCopartLotNumber(lotNumber);
  const meta = await getCopartFeedMeta();
  if (!lot) {
    return {
      vehicle: null as AuctionSearchVehicle | null,
      gallery: [] as string[],
      freshness: meta.freshness,
      error: COPART_LOOKUP_INVALID_LOT,
    };
  }
  if (!meta.snapshot) {
    return { vehicle: null as AuctionSearchVehicle | null, gallery: [] as string[], freshness: meta.freshness, error: meta.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("copart_inventory_cache")
    .select("*")
    .eq("snapshot_id", meta.snapshot.id)
    .eq("lot_number", lot)
    .maybeSingle();

  if (error) {
    return {
      vehicle: null,
      gallery: [] as string[],
      freshness: meta.freshness,
      error: publicActionError(error, "No pudimos cargar el lote Copart."),
    };
  }

  const vehicle = data ? copartVehicleFromCache(data as CopartCacheRecord) : null;
  const gallery = vehicle ? await fetchCopartLotImageUrls(vehicle.imageReference) : [];

  return {
    vehicle,
    gallery,
    freshness: meta.freshness,
    error: null as string | null,
  };
}

export async function addCopartLotToOpportunities(lotNumber: string) {
  await requireAdmin();
  const { vehicle, gallery, error } = await getCopartLot(lotNumber);
  if (error) return { error, id: null as string | null, duplicate: false };
  if (!vehicle) return { error: error ?? COPART_LOT_NOT_FOUND_MESSAGE, id: null, duplicate: false };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("auction_opportunities")
    .select("id")
    .eq("provider", "copart")
    .eq("provider_lot_id", vehicle.lotNumber)
    .maybeSingle();

  if (existing?.id) {
    return { error: COPART_DUPLICATE_LOT_MESSAGE, id: existing.id as string, duplicate: true };
  }

  const payload = copartOpportunityInsert(vehicle, { imageUrls: gallery });
  const { data, error: insertError } = await supabase
    .from("auction_opportunities")
    .insert(payload)
    .select("id")
    .single();

  if (insertError || !data) {
    const message = publicActionError(insertError, "No se pudo guardar la oportunidad.");
    if (message === COPART_DUPLICATE_LOT_MESSAGE || /lote ya está/i.test(message) || /proveedor y número de lote/i.test(message)) {
      const { data: again } = await supabase
        .from("auction_opportunities")
        .select("id")
        .eq("provider", "copart")
        .eq("provider_lot_id", vehicle.lotNumber)
        .maybeSingle();
      return {
        error: COPART_DUPLICATE_LOT_MESSAGE,
        id: (again?.id as string | undefined) ?? null,
        duplicate: true,
      };
    }
    return { error: message, id: null, duplicate: false };
  }

  revalidatePath("/admin/subastas");
  revalidatePath(`/admin/subastas/${data.id}`);
  return { error: null as string | null, id: data.id as string, duplicate: false };
}

export async function findOpportunityByCopartLot(lotNumber: string) {
  await requireAdmin();
  const lot = normalizeCopartLotNumber(lotNumber);
  if (!lot) return { id: null as string | null };
  const supabase = await createClient();
  const { data } = await supabase
    .from("auction_opportunities")
    .select("id")
    .eq("provider", "copart")
    .eq("provider_lot_id", lot)
    .maybeSingle();
  return { id: UUID_RE.test(String(data?.id ?? "")) ? (data?.id as string) : null };
}

export type CopartLotLookupActionResult = {
  status: "found" | "not_found" | "invalid" | "error" | "not_copart";
  error: string | null;
  lot: string | null;
  sourceUrl: string | null;
  duplicateId: string | null;
  vehicle: AuctionSearchVehicle | null;
  gallery: string[];
  prefill: ReturnType<typeof copartPrefillFromVehicle> | null;
  lastUpdated: string | null;
};

export async function lookupCopartLotAction(input: string): Promise<CopartLotLookupActionResult> {
  await requireAdmin();
  const resolved = resolveCopartLotLookupInput(input);
  if (resolved.kind === "not_copart") {
    return {
      status: "not_copart",
      error: null,
      lot: null,
      sourceUrl: resolved.sourceUrl,
      duplicateId: null,
      vehicle: null,
      gallery: [],
      prefill: null,
      lastUpdated: null,
    };
  }
  if (!resolved.lot) {
    return {
      status: "invalid",
      error: COPART_LOOKUP_INVALID_LOT,
      lot: null,
      sourceUrl: resolved.sourceUrl,
      duplicateId: null,
      vehicle: null,
      gallery: [],
      prefill: null,
      lastUpdated: null,
    };
  }

  const { vehicle, gallery, freshness, error } = await getCopartLot(resolved.lot);
  if (error && !vehicle) {
    const invalid = error === COPART_LOOKUP_INVALID_LOT;
    return {
      status: invalid ? "invalid" : "error",
      error,
      lot: resolved.lot,
      sourceUrl: resolved.sourceUrl,
      duplicateId: null,
      vehicle: null,
      gallery: [],
      prefill: null,
      lastUpdated: freshness.value === "sin carga" ? null : freshness.value,
    };
  }
  if (!vehicle) {
    return {
      status: "not_found",
      error: COPART_LOT_NOT_FOUND_MESSAGE,
      lot: resolved.lot,
      sourceUrl: resolved.sourceUrl,
      duplicateId: null,
      vehicle: null,
      gallery: [],
      prefill: null,
      lastUpdated: freshness.value === "sin carga" ? null : freshness.value,
    };
  }

  const duplicate = await findOpportunityByCopartLot(vehicle.lotNumber);
  const prefill = copartPrefillFromVehicle(vehicle, { imageUrls: gallery });
  return {
    status: "found",
    error: null,
    lot: vehicle.lotNumber,
    sourceUrl: vehicle.sourceUrl ?? resolved.sourceUrl,
    duplicateId: duplicate.id,
    vehicle,
    gallery,
    prefill,
    lastUpdated: vehicle.lastUpdated,
  };
}
