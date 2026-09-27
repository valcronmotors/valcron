import type { AuctionSearchVehicle } from "../types";
import { normalizeCopartImageReference } from "./images";
import type { CopartCsvRow } from "./schema";
import { copartLotSourceUrl, normalizeCopartLotNumber } from "./urls";

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
export const COPART_MAX_STORED_TEXT_LENGTH = 512;

const UNKNOWN = new Set(["", "UNKNOWN", "N/A", "NA", "NONE", "NULL"]);

export function blankToNull(value: string | null | undefined) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || UNKNOWN.has(trimmed.toUpperCase())) return null;
  return trimmed;
}

export function normalizeCopartVin(value: string | null | undefined) {
  const compact = String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (!VIN_RE.test(compact)) return null;
  return compact;
}

export function parseCopartYear(value: string | null | undefined) {
  const year = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(year) || year < 1980 || year > 2100) return null;
  return year;
}

export function parseCopartMileage(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const amount = Number.parseFloat(raw);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount);
}

export function parseCopartMoney(value: string | null | undefined) {
  const raw = String(value ?? "").replace(/[$,]/g, "").trim();
  if (!raw) return null;
  const amount = Number.parseFloat(raw);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100) / 100;
}

export function parseCopartCurrency(value: string | null | undefined) {
  const code = blankToNull(value)?.toUpperCase() ?? null;
  if (!code) return null;
  if (!/^[A-Z]{3}$/.test(code)) return null;
  return code;
}

export function parseCopartHasKeys(value: string | null | undefined) {
  const token = String(value ?? "").trim().toUpperCase();
  if (token === "YES" || token === "Y") return true;
  if (token === "NO" || token === "N") return false;
  return null;
}

export function parseCopartSaleDate(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "0") return null;
  if (/^\d{8}$/.test(raw)) {
    const year = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6));
    const day = Number(raw.slice(6, 8));
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null;
    }
    return date.toISOString().slice(0, 10);
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function parseCopartSaleTime(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (/^\d{3,4}$/.test(raw)) {
    const padded = raw.padStart(4, "0");
    return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
  }
  return blankToNull(raw);
}

export function parseCopartTimestamp(value: string | null | undefined) {
  const raw = blankToNull(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function formatCopartLocation(city: string | null, state: string | null) {
  return [city, state].filter(Boolean).join(", ") || null;
}

export function copartSearchText(vehicle: Pick<
  AuctionSearchVehicle,
  "lotNumber" | "vin" | "year" | "make" | "model" | "modelDetail" | "trim" | "location"
>) {
  return [vehicle.lotNumber, vehicle.vin, vehicle.year, vehicle.make, vehicle.model, vehicle.modelDetail, vehicle.trim, vehicle.location]
    .filter((value) => value != null && String(value).length > 0)
    .join(" ")
    .toLowerCase();
}

export function normalizeCopartRow(row: CopartCsvRow): {
  vehicle: AuctionSearchVehicle | null;
  reason: string | null;
} {
  const lotNumber = normalizeCopartLotNumber(row["Lot number"]);
  if (!lotNumber) {
    return { vehicle: null, reason: "missing_lot" };
  }

  const year = parseCopartYear(row.Year);
  if (year == null) {
    return { vehicle: null, reason: "invalid_year" };
  }

  const make = blankToNull(row.Make);
  const model = blankToNull(row["Model Group"]);
  const locationCity = blankToNull(row["Location city"]);
  const locationStateRaw = blankToNull(row["Location state"]);
  const locationState = locationStateRaw ? locationStateRaw.toUpperCase() : null;
  const thumbnailUrl = normalizeCopartImageReference(row["Image Thumbnail"]);
  const imageReference = normalizeCopartImageReference(row["Image URL"]);

  const vehicle: AuctionSearchVehicle = {
    provider: "copart",
    lotNumber,
    vin: normalizeCopartVin(row.VIN),
    year,
    make,
    model,
    modelDetail: blankToNull(row["Model Detail"]),
    trim: blankToNull(row.Trim),
    mileage: parseCopartMileage(row.Odometer),
    mileageUnit: parseCopartMileage(row.Odometer) == null ? null : "mi",
    bodyStyle: blankToNull(row["Body Style"]),
    color: blankToNull(row.Color),
    primaryDamage: blankToNull(row["Damage Description"]),
    secondaryDamage: blankToNull(row["Secondary Damage"]),
    titleState: blankToNull(row["Sale Title State"]),
    titleType: blankToNull(row["Sale Title Type"]),
    hasKeys: parseCopartHasKeys(row["Has Keys-Yes or No"]),
    engine: blankToNull(row.Engine),
    drive: blankToNull(row.Drive),
    transmission: blankToNull(row.Transmission),
    fuel: blankToNull(row["Fuel Type"]),
    cylinders: blankToNull(row.Cylinders),
    runCondition: blankToNull(row["Runs/Drives"]),
    saleStatus: blankToNull(row["Sale Status"]),
    location: formatCopartLocation(locationCity, locationState),
    locationCity,
    locationState,
    saleDate: parseCopartSaleDate(row["Sale Date M/D/CY"]),
    saleTime: parseCopartSaleTime(row["Sale time (HHMM)"]),
    estimatedRetailValue: parseCopartMoney(row["Est. Retail Value"]),
    repairCost: parseCopartMoney(row["Repair cost"]),
    buyItNowPrice: parseCopartMoney(row["Buy-It-Now Price"]),
    currency: parseCopartCurrency(row["Currency Code"]),
    thumbnailUrl,
    imageReference,
    sellerName: blankToNull(row["Seller Name"]),
    lastUpdated: parseCopartTimestamp(row["Last Updated Time"]),
    sourceUrl: copartLotSourceUrl(lotNumber),
  };

  for (const [key, value] of Object.entries(vehicle)) {
    if (typeof value === "string" && value.length > COPART_MAX_STORED_TEXT_LENGTH) {
      return { vehicle: null, reason: `field_too_long:${key}` };
    }
  }

  return { vehicle, reason: null };
}
