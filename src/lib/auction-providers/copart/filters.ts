import type { AuctionProviderSearchFilters } from "../types";

export const COPART_PAGE_SIZE = 36;
export const COPART_MAX_PAGE_SIZE = 50;
export const COPART_STALE_AFTER_MS = 24 * 60 * 60 * 1000;

export function sanitizeSearchNeedle(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .replace(/[%_]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export function normalizeCopartSearchFilters(
  input: AuctionProviderSearchFilters,
): Required<Pick<AuctionProviderSearchFilters, "page" | "pageSize">> & AuctionProviderSearchFilters {
  const page = Math.max(1, Math.floor(Number(input.page) || 1));
  const pageSize = Math.min(
    COPART_MAX_PAGE_SIZE,
    Math.max(1, Math.floor(Number(input.pageSize) || COPART_PAGE_SIZE)),
  );
  const yearMin = Number.isFinite(input.yearMin) ? Math.floor(Number(input.yearMin)) : undefined;
  const yearMax = Number.isFinite(input.yearMax) ? Math.floor(Number(input.yearMax)) : undefined;
  const mileageMin = Number.isFinite(input.mileageMin) ? Math.max(0, Math.floor(Number(input.mileageMin))) : undefined;
  const mileageMax = Number.isFinite(input.mileageMax) ? Math.max(0, Math.floor(Number(input.mileageMax))) : undefined;

  return {
    query: sanitizeSearchNeedle(input.query) || undefined,
    make: sanitizeSearchNeedle(input.make) || undefined,
    model: sanitizeSearchNeedle(input.model) || undefined,
    yearMin: yearMin && yearMin >= 1980 ? yearMin : undefined,
    yearMax: yearMax && yearMax <= 2100 ? yearMax : undefined,
    locationState: sanitizeSearchNeedle(input.locationState)?.toUpperCase() || undefined,
    titleType: sanitizeSearchNeedle(input.titleType) || undefined,
    primaryDamage: sanitizeSearchNeedle(input.primaryDamage) || undefined,
    runCondition: sanitizeSearchNeedle(input.runCondition) || undefined,
    buyItNow: input.buyItNow === true ? true : input.buyItNow === false ? false : undefined,
    mileageMin,
    mileageMax,
    page,
    pageSize,
  };
}

export function copartSearchRange(filters: ReturnType<typeof normalizeCopartSearchFilters>) {
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  return { from, to };
}

export function matchesCopartFilters(
  row: {
    searchText: string;
    make: string | null;
    model: string | null;
    year: number | null;
    locationState: string | null;
    titleType: string | null;
    primaryDamage: string | null;
    runCondition: string | null;
    buyItNowPrice: number | null;
    mileage: number | null;
  },
  filters: ReturnType<typeof normalizeCopartSearchFilters>,
) {
  if (filters.query && !row.searchText.includes(filters.query.toLowerCase())) return false;
  if (filters.make && (row.make ?? "").toLowerCase() !== filters.make.toLowerCase()) return false;
  if (filters.model && !(row.model ?? "").toLowerCase().includes(filters.model.toLowerCase())) return false;
  if (filters.yearMin != null && (row.year == null || row.year < filters.yearMin)) return false;
  if (filters.yearMax != null && (row.year == null || row.year > filters.yearMax)) return false;
  if (filters.locationState && (row.locationState ?? "").toUpperCase() !== filters.locationState) return false;
  if (filters.titleType && (row.titleType ?? "").toUpperCase() !== filters.titleType) return false;
  if (filters.primaryDamage && (row.primaryDamage ?? "").toLowerCase() !== filters.primaryDamage.toLowerCase()) {
    return false;
  }
  if (filters.runCondition && (row.runCondition ?? "").toLowerCase() !== filters.runCondition.toLowerCase()) {
    return false;
  }
  if (filters.buyItNow === true && (row.buyItNowPrice == null || row.buyItNowPrice <= 0)) return false;
  if (filters.buyItNow === false && row.buyItNowPrice != null && row.buyItNowPrice > 0) return false;
  if (filters.mileageMin != null && (row.mileage == null || row.mileage < filters.mileageMin)) return false;
  if (filters.mileageMax != null && (row.mileage == null || row.mileage > filters.mileageMax)) return false;
  return true;
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    items: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
  };
}
