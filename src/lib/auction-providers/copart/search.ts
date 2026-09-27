import type { AuctionSearchVehicle } from "../types";
import { normalizeCopartSearchFilters, copartSearchRange } from "./filters";
import type { AuctionProviderSearchFilters } from "../types";

export type CopartCacheRecord = {
  lot_number: string;
  vin: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  model_detail: string | null;
  trim: string | null;
  mileage: number | null;
  mileage_unit: "mi" | "km" | null;
  body_style: string | null;
  color: string | null;
  primary_damage: string | null;
  secondary_damage: string | null;
  title_state: string | null;
  title_type: string | null;
  has_keys: boolean | null;
  engine: string | null;
  drive: string | null;
  transmission: string | null;
  fuel: string | null;
  cylinders: string | null;
  run_condition: string | null;
  sale_status: string | null;
  location_city: string | null;
  location_state: string | null;
  location: string | null;
  sale_date: string | null;
  sale_time: string | null;
  estimated_retail_value: number | string | null;
  repair_cost: number | string | null;
  buy_it_now_price: number | string | null;
  currency: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
  seller_name: string | null;
  feed_last_updated: string | null;
  source_url: string | null;
  search_text?: string | null;
};

export function copartVehicleFromCache(row: CopartCacheRecord): AuctionSearchVehicle {
  const money = (value: number | string | null) => {
    if (value == null || value === "") return null;
    const amount = typeof value === "number" ? value : Number(value);
    return Number.isFinite(amount) ? amount : null;
  };

  return {
    provider: "copart",
    lotNumber: row.lot_number,
    vin: row.vin,
    year: row.year,
    make: row.make,
    model: row.model,
    modelDetail: row.model_detail,
    trim: row.trim,
    mileage: row.mileage,
    mileageUnit: row.mileage_unit,
    bodyStyle: row.body_style,
    color: row.color,
    primaryDamage: row.primary_damage,
    secondaryDamage: row.secondary_damage,
    titleState: row.title_state,
    titleType: row.title_type,
    hasKeys: row.has_keys,
    engine: row.engine,
    drive: row.drive,
    transmission: row.transmission,
    fuel: row.fuel,
    cylinders: row.cylinders,
    runCondition: row.run_condition,
    saleStatus: row.sale_status,
    location: row.location,
    locationCity: row.location_city,
    locationState: row.location_state,
    saleDate: row.sale_date,
    saleTime: row.sale_time,
    estimatedRetailValue: money(row.estimated_retail_value),
    repairCost: money(row.repair_cost),
    buyItNowPrice: money(row.buy_it_now_price),
    currency: row.currency,
    thumbnailUrl: row.thumbnail_url,
    imageReference: row.image_url,
    sellerName: row.seller_name,
    lastUpdated: row.feed_last_updated,
    sourceUrl: row.source_url,
  };
}

export function copartSearchQueryPlan(input: AuctionProviderSearchFilters) {
  const filters = normalizeCopartSearchFilters(input);
  const range = copartSearchRange(filters);
  const exactLot = filters.query && /^\d{5,12}$/.test(filters.query) ? filters.query : null;
  const exactVin = filters.query && /^[A-HJ-NPR-Z0-9]{17}$/i.test(filters.query)
    ? filters.query.toUpperCase()
    : null;

  return { filters, range, exactLot, exactVin };
}
