import type { VehicleMileageUnit, VehicleRow, VehicleSourceType, VehicleStatus } from "@/lib/website-schema";
import { resolvePublicPriceMode, type PublicPriceMode } from "@/lib/public-price-mode";

export const VEHICLE_DRAFT_STORAGE_KEY = "valcron:vehicle-draft:v1";
export const VEHICLE_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export const VEHICLE_FORM_ERRORS = {
  year: "Ingresa el año del vehículo.",
  make: "Ingresa la marca.",
  model: "Ingresa el modelo.",
  vin: "El VIN debe contener 17 caracteres válidos.",
  price: "El precio debe ser mayor que cero.",
} as const;

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export type VehicleFormValues = {
  stock_number: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  mileage_unit: VehicleMileageUnit;
  exterior_color: string;
  interior_color: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  fuel: string;
  condition: string;
  description: string;
  price: string;
  currency: "USD" | "DOP";
  public_price_mode: PublicPriceMode;
  source_type: VehicleSourceType;
  featured: boolean;
};

export type VehicleFormField = keyof VehicleFormValues;

export type VehicleFieldErrors = Partial<Record<VehicleFormField | "_form", string>>;

type DraftRecord = {
  savedAt: number;
  values: VehicleFormValues;
};

export function emptyVehicleFormValues(now = new Date()): VehicleFormValues {
  return {
    stock_number: "",
    vin: "",
    year: String(now.getFullYear()),
    make: "",
    model: "",
    trim: "",
    mileage: "",
    mileage_unit: "mi",
    exterior_color: "",
    interior_color: "",
    engine: "",
    transmission: "",
    drivetrain: "",
    fuel: "",
    condition: "",
    description: "",
    price: "",
    currency: "USD",
    public_price_mode: "fixed",
    source_type: "valcron_stock",
    featured: false,
  };
}

export function vehicleFormValuesFromRow(vehicle: VehicleRow): VehicleFormValues {
  return {
    stock_number: vehicle.stock_number ?? "",
    vin: vehicle.vin ?? "",
    year: vehicle.year ? String(vehicle.year) : "",
    make: vehicle.make ?? "",
    model: vehicle.model ?? "",
    trim: vehicle.trim ?? "",
    mileage: vehicle.mileage != null ? String(vehicle.mileage) : "",
    mileage_unit: vehicle.mileage_unit === "km" ? "km" : "mi",
    exterior_color: vehicle.exterior_color ?? "",
    interior_color: vehicle.interior_color ?? "",
    engine: vehicle.engine ?? "",
    transmission: vehicle.transmission ?? "",
    drivetrain: vehicle.drivetrain ?? "",
    fuel: vehicle.fuel ?? "",
    condition: vehicle.condition ?? "",
    description: vehicle.description ?? "",
    price: vehicle.price != null ? String(vehicle.price) : "",
    currency: vehicle.currency === "DOP" ? "DOP" : "USD",
    public_price_mode: resolvePublicPriceMode(vehicle.source_type, vehicle.public_price_mode),
    source_type: vehicle.source_type,
    featured: Boolean(vehicle.featured),
  };
}

export function validateVehicleFormValues(values: VehicleFormValues): {
  ok: boolean;
  fieldErrors: VehicleFieldErrors;
  firstField: VehicleFormField | null;
} {
  const fieldErrors: VehicleFieldErrors = {};
  const year = Number(values.year);
  if (!values.year.trim() || !Number.isFinite(year) || year < 1980 || year > 2100) {
    fieldErrors.year = VEHICLE_FORM_ERRORS.year;
  }
  if (!values.make.trim()) {
    fieldErrors.make = VEHICLE_FORM_ERRORS.make;
  }
  if (!values.model.trim()) {
    fieldErrors.model = VEHICLE_FORM_ERRORS.model;
  }
  const vin = values.vin.trim().toUpperCase();
  if (vin && !VIN_RE.test(vin)) {
    fieldErrors.vin = VEHICLE_FORM_ERRORS.vin;
  }
  const priceRaw = values.price.trim();
  if (priceRaw) {
    const price = Number(priceRaw.replace(/[^0-9.-]/g, ""));
    if (!Number.isFinite(price) || price <= 0) {
      fieldErrors.price = VEHICLE_FORM_ERRORS.price;
    }
  }

  const order: VehicleFormField[] = ["year", "make", "model", "vin", "price"];
  const firstField = order.find((field) => fieldErrors[field]) ?? null;
  if (firstField) {
    fieldErrors._form = fieldErrors[firstField];
  }

  return {
    ok: !firstField,
    fieldErrors,
    firstField,
  };
}

/** Always create unpublished. Availability status comes from the form when set. */
export function vehicleCreateDefaults() {
  return {
    published: false as const,
    published_at: null,
  };
}

export function omitUnusedVehicleColumns<T extends object>(data: T) {
  const rest = { ...data } as T & { title_status?: unknown; location?: unknown };
  delete rest.title_status;
  delete rest.location;
  return rest;
}

export function createFormDoesNotCollectStatus(formKeys: string[]) {
  return !formKeys.includes("status") && !formKeys.includes("title_status") && !formKeys.includes("location");
}

export function vehicleFormDataFromValues(
  values: VehicleFormValues,
  options: {
    id?: string | null;
    status?: VehicleStatus;
    published?: boolean;
  } = {},
) {
  const formData = new FormData();
  if (options.id) formData.set("id", options.id);
  formData.set("stock_number", values.stock_number);
  formData.set("vin", values.vin);
  formData.set("year", values.year);
  formData.set("make", values.make);
  formData.set("model", values.model);
  formData.set("trim", values.trim);
  formData.set("mileage", values.mileage);
  formData.set("mileage_unit", values.mileage_unit);
  formData.set("exterior_color", values.exterior_color);
  formData.set("interior_color", values.interior_color);
  formData.set("engine", values.engine);
  formData.set("transmission", values.transmission);
  formData.set("drivetrain", values.drivetrain);
  formData.set("fuel", values.fuel);
  formData.set("condition", values.condition);
  formData.set("description", values.description);
  formData.set("price", values.price);
  formData.set("currency", values.currency);
  formData.set("public_price_mode", values.public_price_mode);
  formData.set("source_type", values.source_type);
  formData.set("featured", values.featured ? "true" : "false");
  if (options.status) formData.set("status", options.status);
  if (options.published != null) formData.set("published", options.published ? "true" : "false");
  return formData;
}

export function beginVehicleSubmit(lock: { current: boolean }) {
  if (lock.current) return false;
  lock.current = true;
  return true;
}

export function endVehicleSubmit(lock: { current: boolean }) {
  lock.current = false;
}

export function isVehicleDraftExpired(savedAt: number, now = Date.now()) {
  return now - savedAt > VEHICLE_DRAFT_TTL_MS;
}

export function writeVehicleDraft(
  storage: Pick<Storage, "setItem">,
  values: VehicleFormValues,
  now = Date.now(),
) {
  const record: DraftRecord = { savedAt: now, values };
  storage.setItem(VEHICLE_DRAFT_STORAGE_KEY, JSON.stringify(record));
}

export function clearVehicleDraft(storage: Pick<Storage, "removeItem">) {
  storage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
}

export function readVehicleDraft(
  storage: Pick<Storage, "getItem" | "removeItem">,
  now = Date.now(),
): VehicleFormValues | null {
  const raw = storage.getItem(VEHICLE_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DraftRecord;
    if (!parsed || typeof parsed.savedAt !== "number" || !parsed.values) {
      storage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
      return null;
    }
    if (isVehicleDraftExpired(parsed.savedAt, now)) {
      storage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
      return null;
    }
    return { ...emptyVehicleFormValues(), ...parsed.values };
  } catch {
    storage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function preserveVehicleFormValues<T extends VehicleFormValues>(values: T): T {
  return { ...values };
}
