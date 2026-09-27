import type { CopartCacheRow } from "./ingest";
import { COPART_MAX_STORED_TEXT_LENGTH } from "./normalizer";

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const HTTPS_RE = /^https:\/\//;
const PG_INT_MAX = 2_147_483_647;
const NUMERIC_12_2_MAX = 9_999_999_999.99;

function hasNul(value: unknown) {
  return typeof value === "string" && value.includes("\u0000");
}

function moneyOverflow(value: number | null | undefined) {
  return value != null && (!Number.isFinite(value) || value > NUMERIC_12_2_MAX || value < 0);
}

export function assessCopartCacheInsert(row: CopartCacheRow): string[] {
  const issues: string[] = [];
  if (!row.lotNumber) issues.push("missing_lot");
  if (hasNul(row.lotNumber)) issues.push("nul:lotNumber");
  if (row.vin != null && !VIN_RE.test(row.vin)) issues.push("vin_format");
  if (row.year != null && (row.year < 1980 || row.year > 2100)) issues.push("year_range");
  if (row.mileage != null && (row.mileage < 0 || row.mileage > PG_INT_MAX)) issues.push("mileage_int4");
  if (row.mileageUnit != null && row.mileageUnit !== "mi" && row.mileageUnit !== "km") {
    issues.push("mileage_unit");
  }
  if (moneyOverflow(row.estimatedRetailValue)) issues.push("retail_numeric_12_2");
  if (moneyOverflow(row.repairCost)) issues.push("repair_numeric_12_2");
  if (moneyOverflow(row.buyItNowPrice)) issues.push("bin_numeric_12_2");
  if (row.thumbnailUrl != null && !HTTPS_RE.test(row.thumbnailUrl)) issues.push("thumbnail_https");
  if (row.imageReference != null && !HTTPS_RE.test(row.imageReference)) issues.push("image_https");
  if (row.sourceUrl != null && !HTTPS_RE.test(row.sourceUrl)) issues.push("source_https");
  if (row.saleDate != null && !/^\d{4}-\d{2}-\d{2}$/.test(row.saleDate)) issues.push("sale_date_format");
  if (row.lastUpdated != null && Number.isNaN(Date.parse(row.lastUpdated))) issues.push("last_updated");
  for (const [key, value] of Object.entries(row)) {
    if (hasNul(value)) issues.push(`nul:${key}`);
    if (typeof value === "string" && value.length > COPART_MAX_STORED_TEXT_LENGTH && key !== "searchText") {
      issues.push(`too_long:${key}`);
    }
  }
  return issues;
}
