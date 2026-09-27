import { createReadStream } from "node:fs";
import { basename } from "node:path";
import type { AuctionProviderFacets, AuctionSearchVehicle } from "../types";
import { csvRowLooksMalformed, streamCsvRecords } from "./csv";
import { copartSearchText, normalizeCopartRow } from "./normalizer";
import type { CopartInsertBatchMeta } from "./ingest-error";
import { validateCopartHeaders, zipCopartRow } from "./schema";

export const COPART_INGEST_BATCH_SIZE = 250;

export type CopartCacheRow = AuctionSearchVehicle & {
  searchText: string;
};

export type CopartIngestStats = {
  rowsRead: number;
  valid: number;
  rejected: number;
  duplicates: number;
  inserted: number;
  durationMs: number;
  feedTimestamp: string | null;
  sourceFilename: string;
  facets: AuctionProviderFacets;
};

export type CopartSnapshotWriter = {
  createStaging(input: { sourceFilename: string }): Promise<string>;
  insertBatch(snapshotId: string, rows: CopartCacheRow[], meta?: CopartInsertBatchMeta): Promise<void>;
  activate(snapshotId: string, stats: CopartIngestStats): Promise<void>;
  fail(snapshotId: string, message: string): Promise<void>;
};

type FacetSets = {
  makes: Set<string>;
  models: Set<string>;
  locationStates: Set<string>;
  titleTypes: Set<string>;
  primaryDamages: Set<string>;
  runConditions: Set<string>;
};

export function emptyFacets(): AuctionProviderFacets {
  return {
    makes: [],
    models: [],
    locationStates: [],
    titleTypes: [],
    primaryDamages: [],
    runConditions: [],
  };
}

function emptyFacetSets(): FacetSets {
  return {
    makes: new Set(),
    models: new Set(),
    locationStates: new Set(),
    titleTypes: new Set(),
    primaryDamages: new Set(),
    runConditions: new Set(),
  };
}

function addFacet(set: Set<string>, value: string | null) {
  if (value) set.add(value);
}

export function freezeFacets(sets: FacetSets): AuctionProviderFacets {
  const sorted = (values: Set<string>) => [...values].sort((a, b) => a.localeCompare(b));
  return {
    makes: sorted(sets.makes),
    models: sorted(sets.models).slice(0, 400),
    locationStates: sorted(sets.locationStates),
    titleTypes: sorted(sets.titleTypes),
    primaryDamages: sorted(sets.primaryDamages),
    runConditions: sorted(sets.runConditions),
  };
}

export async function ingestCopartCsv(options: {
  filePath: string;
  writer?: CopartSnapshotWriter;
  keepRows?: boolean;
  onProgress?: (stats: Pick<CopartIngestStats, "rowsRead" | "valid" | "rejected">) => void;
}) {
  const started = Date.now();
  const sourceFilename = basename(options.filePath);
  let snapshotId: string | null = null;
  const seenLots = new Set<string>();
  const facetSets = emptyFacetSets();
  const keptRows: CopartCacheRow[] = [];
  let headers: string[] | null = null;
  let rowsRead = 0;
  let valid = 0;
  let rejected = 0;
  let duplicates = 0;
  let inserted = 0;
  let batchesInserted = 0;
  let feedTimestamp: string | null = null;
  let batch: CopartCacheRow[] = [];

  async function flush() {
    if (!options.writer || !snapshotId || batch.length === 0) {
      batch = [];
      return;
    }
    const meta: CopartInsertBatchMeta = {
      batchNumber: batchesInserted + 1,
      csvRowsRead: rowsRead,
      rowCount: batch.length,
      lotNumbers: batch.map((row) => row.lotNumber),
    };
    await options.writer.insertBatch(snapshotId, batch, meta);
    inserted += batch.length;
    batchesInserted += 1;
    batch = [];
  }

  try {
    if (options.writer) {
      snapshotId = await options.writer.createStaging({ sourceFilename });
    }

    const stream = createReadStream(options.filePath, { encoding: "utf8" });
    await streamCsvRecords(stream, async (record) => {
      if (!headers) {
        const first = (record[0] ?? "").replace(/^\uFEFF/, "");
        headers = [first, ...record.slice(1)];
        const validation = validateCopartHeaders(headers);
        if (!validation.ok) {
          throw new Error(
            `Encabezados Copart inválidos. Faltan: ${validation.missing.join(", ") || "desconocidos"}.`,
          );
        }
        return;
      }

      rowsRead += 1;
      const malformed = csvRowLooksMalformed(headers, record);
      if (malformed) {
        rejected += 1;
        return;
      }

      const zipped = zipCopartRow(headers, record);
      if (!zipped) {
        rejected += 1;
        return;
      }

      const normalized = normalizeCopartRow(zipped);
      if (!normalized.vehicle) {
        rejected += 1;
        return;
      }

      if (seenLots.has(normalized.vehicle.lotNumber)) {
        duplicates += 1;
        return;
      }
      seenLots.add(normalized.vehicle.lotNumber);

      const cacheRow: CopartCacheRow = {
        ...normalized.vehicle,
        searchText: copartSearchText(normalized.vehicle),
      };
      addFacet(facetSets.makes, cacheRow.make);
      addFacet(facetSets.models, cacheRow.model);
      addFacet(facetSets.locationStates, cacheRow.locationState);
      addFacet(facetSets.titleTypes, cacheRow.titleType);
      addFacet(facetSets.primaryDamages, cacheRow.primaryDamage);
      addFacet(facetSets.runConditions, cacheRow.runCondition);
      if (cacheRow.lastUpdated && (!feedTimestamp || cacheRow.lastUpdated > feedTimestamp)) {
        feedTimestamp = cacheRow.lastUpdated;
      }
      if (options.keepRows) keptRows.push(cacheRow);
      valid += 1;
      batch.push(cacheRow);
      if (batch.length >= COPART_INGEST_BATCH_SIZE) {
        await flush();
      }
      if (rowsRead % 5000 === 0) {
        options.onProgress?.({ rowsRead, valid, rejected });
      }
    });

    if (!headers) {
      throw new Error("El CSV de Copart no tiene encabezados.");
    }

    await flush();

    const stats: CopartIngestStats = {
      rowsRead,
      valid,
      rejected,
      duplicates,
      inserted: options.writer ? inserted : valid,
      durationMs: Date.now() - started,
      feedTimestamp,
      sourceFilename,
      facets: freezeFacets(facetSets),
    };

    if (options.writer && snapshotId) {
      if (valid === 0) {
        throw new Error("Ninguna fila válida. Se conserva el inventario anterior.");
      }
      await options.writer.activate(snapshotId, stats);
    }

    return { ok: true as const, snapshotId, stats, rows: keptRows };
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo importar el CSV de Copart.";
    if (options.writer && snapshotId) {
      await options.writer.fail(snapshotId, message);
    }
    return {
      ok: false as const,
      snapshotId,
      error: message,
      stats: {
        rowsRead,
        valid,
        rejected,
        duplicates,
        inserted,
        durationMs: Date.now() - started,
        feedTimestamp,
        sourceFilename,
        facets: freezeFacets(facetSets),
      },
      rows: keptRows,
    };
  }
}
