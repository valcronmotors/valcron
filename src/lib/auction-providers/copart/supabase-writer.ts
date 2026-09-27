import type { CopartCacheRow, CopartIngestStats, CopartSnapshotWriter } from "./ingest";
import { formatCopartInsertError, type CopartInsertBatchMeta } from "./ingest-error";
import { createAdminClient } from "../../../utils/supabase/admin";

export const COPART_CACHE_INSERT_COLUMNS = [
  "snapshot_id",
  "lot_number",
  "vin",
  "year",
  "make",
  "model",
  "model_detail",
  "trim",
  "mileage",
  "mileage_unit",
  "body_style",
  "color",
  "primary_damage",
  "secondary_damage",
  "title_state",
  "title_type",
  "has_keys",
  "engine",
  "drive",
  "transmission",
  "fuel",
  "cylinders",
  "run_condition",
  "sale_status",
  "location_city",
  "location_state",
  "location",
  "sale_date",
  "sale_time",
  "estimated_retail_value",
  "repair_cost",
  "buy_it_now_price",
  "currency",
  "thumbnail_url",
  "image_url",
  "seller_name",
  "feed_last_updated",
  "source_url",
  "search_text",
] as const;

function cacheInsert(snapshotId: string, row: CopartCacheRow) {
  return {
    snapshot_id: snapshotId,
    lot_number: row.lotNumber,
    vin: row.vin,
    year: row.year,
    make: row.make,
    model: row.model,
    model_detail: row.modelDetail,
    trim: row.trim,
    mileage: row.mileage,
    mileage_unit: row.mileageUnit,
    body_style: row.bodyStyle,
    color: row.color,
    primary_damage: row.primaryDamage,
    secondary_damage: row.secondaryDamage,
    title_state: row.titleState,
    title_type: row.titleType,
    has_keys: row.hasKeys,
    engine: row.engine,
    drive: row.drive,
    transmission: row.transmission,
    fuel: row.fuel,
    cylinders: row.cylinders,
    run_condition: row.runCondition,
    sale_status: row.saleStatus,
    location_city: row.locationCity,
    location_state: row.locationState,
    location: row.location,
    sale_date: row.saleDate,
    sale_time: row.saleTime,
    estimated_retail_value: row.estimatedRetailValue,
    repair_cost: row.repairCost,
    buy_it_now_price: row.buyItNowPrice,
    currency: row.currency,
    thumbnail_url: row.thumbnailUrl,
    image_url: row.imageReference,
    seller_name: row.sellerName,
    feed_last_updated: row.lastUpdated,
    source_url: row.sourceUrl,
    search_text: row.searchText,
  };
}

export function createSupabaseCopartWriter(): CopartSnapshotWriter {
  const supabase = createAdminClient();

  return {
    async createStaging(input) {
      const { data, error } = await supabase
        .from("copart_feed_snapshots")
        .insert({
          status: "staging",
          source_filename: input.sourceFilename,
        })
        .select("id")
        .single();
      if (error || !data) {
        throw new Error("No se pudo crear el snapshot de importación Copart.");
      }
      return data.id as string;
    },

    async insertBatch(snapshotId, rows, meta) {
      const { error } = await supabase.from("copart_inventory_cache").insert(rows.map((row) => cacheInsert(snapshotId, row)));
      if (error) {
        throw new Error(
          formatCopartInsertError(error, {
            batchNumber: meta?.batchNumber ?? 0,
            csvRowsRead: meta?.csvRowsRead ?? 0,
            rowCount: meta?.rowCount ?? rows.length,
            lotNumbers: meta?.lotNumbers ?? rows.map((row) => row.lotNumber),
          } satisfies CopartInsertBatchMeta),
        );
      }
    },

    async activate(snapshotId, stats: CopartIngestStats) {
      const { error } = await supabase.rpc("activate_copart_feed_snapshot", {
        p_snapshot_id: snapshotId,
        p_row_count: stats.valid,
        p_rows_read: stats.rowsRead,
        p_rows_rejected: stats.rejected,
        p_rows_duplicates: stats.duplicates,
        p_feed_last_updated: stats.feedTimestamp,
        p_facets: stats.facets,
      });
      if (error) {
        throw new Error("No se pudo activar el snapshot Copart. El inventario anterior sigue vigente.");
      }
    },

    async fail(snapshotId, message) {
      await supabase.rpc("fail_copart_feed_snapshot", {
        p_snapshot_id: snapshotId,
        p_message: message.slice(0, 500),
      });
    },
  };
}
