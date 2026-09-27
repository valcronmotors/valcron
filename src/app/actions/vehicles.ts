"use server";

import { revalidatePath, updateTag } from "next/cache";
import { publicActionError } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/auth";
import {
  canPublishVehicleListing,
  publicationBlockers,
  vehiclePublicationChecks,
} from "@/lib/publication-readiness";
import {
  canPublishVehicleStatus,
  isPublicPriceMode,
  isVehicleSourceType,
  isVehicleStatus,
  type VehicleMileageUnit,
  type VehicleRow,
  type VehicleSourceType,
  type VehicleStatus,
} from "@/lib/website-schema";
import {
  defaultPublicPriceMode,
  isMissingPublicPriceModeColumn,
  omitPublicPriceModeColumn,
  resolvePublicPriceMode,
  vehicleSelectWithoutPublicPriceMode,
  type PublicPriceMode,
} from "@/lib/public-price-mode";
import { VEHICLE_PHOTOS_BUCKET } from "@/lib/storage";
import { mergeVehicleStoragePaths } from "@/lib/vehicle-image-delivery";
import { PUBLIC_INVENTORY_CACHE_TAG } from "@/lib/public-cache";
import {
  omitUnusedVehicleColumns,
  vehicleCreateDefaults,
  VEHICLE_FORM_ERRORS,
} from "@/lib/vehicle-form-state";
import { createClient } from "@/utils/supabase/server";

export type VehicleActionState = {
  error: string | null;
  success?: string | null;
  id?: string;
};

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function required(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function intOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.round(value) : null;
}

function moneyOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").replace(/[^0-9.-]/g, "");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function bool(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "");
  return value === "on" || value === "true" || value === "1";
}

export type VehicleInput = {
  stock_number: string | null;
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  mileage_unit: VehicleMileageUnit;
  exterior_color: string | null;
  interior_color: string | null;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  fuel: string | null;
  condition: string | null;
  description: string | null;
  price: number | null;
  currency: "USD" | "DOP";
  public_price_mode: PublicPriceMode;
  source_type: VehicleSourceType;
  status: VehicleStatus;
  featured: boolean;
  published: boolean;
};

function parseVehicleForm(formData: FormData): { data: VehicleInput | null; error: string | null } {
  const year = intOrNull(formData, "year");
  const make = required(formData, "make");
  const model = required(formData, "model");
  const vin = text(formData, "vin")?.toUpperCase() ?? null;
  const statusRaw = required(formData, "status") || "draft";
  const sourceRaw = required(formData, "source_type") || "valcron_stock";
  const mileageUnit = required(formData, "mileage_unit") === "km" ? "km" : "mi";
  const currency = required(formData, "currency") === "DOP" ? "DOP" : "USD";
  const published = bool(formData, "published");
  const status = isVehicleStatus(statusRaw) ? statusRaw : null;
  const source_type = isVehicleSourceType(sourceRaw) ? sourceRaw : null;

  if (!year || year < 1980 || year > 2100) {
    return { data: null, error: VEHICLE_FORM_ERRORS.year };
  }
  if (!make) {
    return { data: null, error: VEHICLE_FORM_ERRORS.make };
  }
  if (!model) {
    return { data: null, error: VEHICLE_FORM_ERRORS.model };
  }
  if (vin && !VIN_RE.test(vin)) {
    return { data: null, error: VEHICLE_FORM_ERRORS.vin };
  }
  const price = moneyOrNull(formData, "price");
  if (price != null && price <= 0) {
    return { data: null, error: VEHICLE_FORM_ERRORS.price };
  }
  if (!status || !source_type) {
    return { data: null, error: "Estado o origen inválido." };
  }
  const modeRaw = required(formData, "public_price_mode");
  const public_price_mode = resolvePublicPriceMode(
    source_type,
    isPublicPriceMode(modeRaw) ? modeRaw : defaultPublicPriceMode(source_type),
  );
  if (published && !canPublishVehicleStatus(status)) {
    return {
      data: null,
      error: "Solo se puede publicar un vehículo disponible, reservado o vendido.",
    };
  }

  return {
    data: {
      stock_number: text(formData, "stock_number"),
      vin,
      year,
      make,
      model,
      trim: text(formData, "trim"),
      mileage: intOrNull(formData, "mileage"),
      mileage_unit: mileageUnit,
      exterior_color: text(formData, "exterior_color"),
      interior_color: text(formData, "interior_color"),
      engine: text(formData, "engine"),
      transmission: text(formData, "transmission"),
      drivetrain: text(formData, "drivetrain"),
      fuel: text(formData, "fuel"),
      condition: text(formData, "condition"),
      description: text(formData, "description"),
      price,
      currency,
      public_price_mode,
      source_type,
      status,
      featured: bool(formData, "featured"),
      published,
    },
    error: null,
  };
}

function revalidateVehicles(id?: string) {
  updateTag(PUBLIC_INVENTORY_CACHE_TAG);
  revalidatePath("/admin");
  revalidatePath("/admin/inventario");
  revalidatePath("/inventario");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (id) {
    revalidatePath(`/admin/inventario/${id}`);
    revalidatePath(`/inventario/${id}`);
  }
}

export async function createVehicle(
  _prev: VehicleActionState | null,
  formData: FormData,
): Promise<VehicleActionState> {
  await requireAdmin();
  const parsed = parseVehicleForm(formData);
  if (!parsed.data) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const payload = {
    ...omitUnusedVehicleColumns(parsed.data),
    ...vehicleCreateDefaults(),
  };
  let { data, error } = await supabase.from("vehicles").insert(payload).select("id").single();
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ data, error } = await supabase
      .from("vehicles")
      .insert(omitPublicPriceModeColumn(payload as Record<string, unknown>))
      .select("id")
      .single());
  }

  if (error || !data) {
    return { error: publicActionError(error, "No se pudo crear el vehículo.") };
  }

  revalidateVehicles(data.id);
  return { error: null, success: "Vehículo creado correctamente.", id: data.id };
}

export async function updateVehicle(
  _prev: VehicleActionState | null,
  formData: FormData,
): Promise<VehicleActionState> {
  await requireAdmin();
  const id = required(formData, "id");
  if (!UUID_RE.test(id)) {
    return { error: "Vehículo inválido." };
  }

  const parsed = parseVehicleForm(formData);
  if (!parsed.data) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const publicationSelect =
    "id, year, make, model, description, price, public_price_mode, source_type, status, vehicle_photos ( id, is_cover )";
  if (parsed.data.published) {
    const first = await supabase
      .from("vehicles")
      .select(publicationSelect)
      .eq("id", id)
      .maybeSingle();
    const current =
      first.error && isMissingPublicPriceModeColumn(first.error)
        ? (
            await supabase
              .from("vehicles")
              .select(vehicleSelectWithoutPublicPriceMode(publicationSelect))
              .eq("id", id)
              .maybeSingle()
          ).data
        : first.data;
    const blocked = publicationBlockMessage({
      year: parsed.data.year,
      make: parsed.data.make,
      model: parsed.data.model,
      description: parsed.data.description,
      price: parsed.data.price,
      public_price_mode: parsed.data.public_price_mode,
      source_type: parsed.data.source_type,
      status: parsed.data.status,
      photos: (current as VehicleRow | null)?.vehicle_photos,
    });
    if (blocked) {
      return { error: blocked };
    }
  }

  const payload = omitUnusedVehicleColumns(parsed.data);
  let { error } = await supabase.from("vehicles").update(payload).eq("id", id);
  if (error && isMissingPublicPriceModeColumn(error)) {
    ({ error } = await supabase
      .from("vehicles")
      .update(omitPublicPriceModeColumn(payload as Record<string, unknown>))
      .eq("id", id));
  }

  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar el vehículo.") };
  }

  revalidateVehicles(id);
  return { error: null, success: "Vehículo actualizado.", id };
}

export async function setVehicleStatus(vehicleId: string, status: VehicleStatus) {
  await requireAdmin();
  if (!UUID_RE.test(vehicleId) || !isVehicleStatus(status)) {
    return { error: "Datos inválidos." };
  }

  const supabase = await createClient();
  const patch: Partial<VehicleRow> = { status };
  if (status === "draft" || status === "hidden") {
    patch.published = false;
  }

  const { error } = await supabase.from("vehicles").update(patch).eq("id", vehicleId);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar el estado.") };
  }
  revalidateVehicles(vehicleId);
  return { error: null };
}

function publicationBlockMessage(input: Parameters<typeof vehiclePublicationChecks>[0]) {
  const checks = vehiclePublicationChecks(input);
  if (canPublishVehicleListing(checks)) {
    return null;
  }
  const missing = publicationBlockers(checks);
  return `Completa lo obligatorio antes de publicar: ${missing.join(", ")}.`;
}

export async function setVehiclePublished(vehicleId: string, published: boolean) {
  await requireAdmin();
  if (!UUID_RE.test(vehicleId)) {
    return { error: "Vehículo inválido." };
  }

  const supabase = await createClient();
  const publicationSelect =
    "id, year, make, model, description, price, public_price_mode, source_type, status, published_at, vehicle_photos ( id, is_cover )";
  let { data, error: lookupError } = await supabase
    .from("vehicles")
    .select(publicationSelect)
    .eq("id", vehicleId)
    .maybeSingle();
  if (lookupError && isMissingPublicPriceModeColumn(lookupError)) {
    ({ data, error: lookupError } = await supabase
      .from("vehicles")
      .select(vehicleSelectWithoutPublicPriceMode(publicationSelect))
      .eq("id", vehicleId)
      .maybeSingle());
  }

  if (lookupError || !data) {
    return { error: publicActionError(lookupError, "Vehículo no encontrado.") };
  }
  const vehicle = data as VehicleRow;
  if (published) {
    const blocked = publicationBlockMessage({
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      description: vehicle.description,
      price: vehicle.price,
      public_price_mode: vehicle.public_price_mode,
      source_type: vehicle.source_type,
      status: vehicle.status,
      photos: vehicle.vehicle_photos,
    });
    if (blocked) {
      return { error: blocked };
    }
  }

  const { error } = await supabase
    .from("vehicles")
    .update(
      published
        ? { published: true, published_at: vehicle.published_at ?? new Date().toISOString() }
        : { published: false },
    )
    .eq("id", vehicleId);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la publicación.") };
  }
  revalidateVehicles(vehicleId);
  return { error: null };
}

export async function setVehicleFeatured(vehicleId: string, featured: boolean) {
  await requireAdmin();
  if (!UUID_RE.test(vehicleId)) {
    return { error: "Vehículo inválido." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").update({ featured }).eq("id", vehicleId);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar el destacado.") };
  }
  revalidateVehicles(vehicleId);
  return { error: null };
}

export async function attachVehiclePhotos(input: {
  vehicleId: string;
  paths: string[];
  coverPath?: string | null;
  altTexts?: Record<string, string>;
}) {
  await requireAdmin();
  if (!UUID_RE.test(input.vehicleId) || input.paths.length === 0) {
    return { error: "No hay fotos para guardar." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("vehicle_photos")
    .select("sort_order, is_cover")
    .eq("vehicle_id", input.vehicleId)
    .order("sort_order", { ascending: false });

  const start = (existing?.[0]?.sort_order ?? -1) + 1;
  const hasCover = Boolean(existing?.some((row) => row.is_cover));

  const rows = input.paths.map((storage_path, index) => ({
    vehicle_id: input.vehicleId,
    storage_path,
    sort_order: start + index,
    is_cover: input.coverPath
      ? storage_path === input.coverPath
      : !hasCover && index === 0,
    alt_text: input.altTexts?.[storage_path] ?? null,
  }));

  const { error } = await supabase.from("vehicle_photos").insert(rows);
  if (error) {
    return { error: publicActionError(error, "No se pudieron guardar las fotos.") };
  }

  revalidateVehicles(input.vehicleId);
  return { error: null };
}

export async function updateVehiclePhoto(input: {
  id: string;
  vehicleId: string;
  alt_text?: string | null;
  is_cover?: boolean;
  sort_order?: number;
}) {
  await requireAdmin();
  if (!UUID_RE.test(input.id) || !UUID_RE.test(input.vehicleId)) {
    return { error: "Foto inválida." };
  }

  const supabase = await createClient();
  const patch: Record<string, unknown> = {};
  if (input.alt_text !== undefined) patch.alt_text = input.alt_text;
  if (input.is_cover !== undefined) patch.is_cover = input.is_cover;
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order;

  const { error } = await supabase.from("vehicle_photos").update(patch).eq("id", input.id);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la foto.") };
  }
  revalidateVehicles(input.vehicleId);
  return { error: null };
}

export async function reorderVehiclePhotos(vehicleId: string, orderedIds: string[]) {
  await requireAdmin();
  if (!UUID_RE.test(vehicleId)) {
    return { error: "Vehículo inválido." };
  }
  const supabase = await createClient();
  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from("vehicle_photos")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("vehicle_id", vehicleId);
    if (error) {
      return { error: publicActionError(error, "No se pudo reordenar las fotos.") };
    }
  }
  revalidateVehicles(vehicleId);
  return { error: null };
}

export async function deleteVehiclePhoto(input: { id: string; vehicleId: string; storagePath: string }) {
  await requireAdmin();
  if (!UUID_RE.test(input.id)) {
    return { error: "Foto inválida." };
  }
  const supabase = await createClient();
  const { data: current } = await supabase
    .from("vehicle_photos")
    .select("id, is_cover")
    .eq("id", input.id)
    .maybeSingle();

  const { error } = await supabase.from("vehicle_photos").delete().eq("id", input.id);
  if (error) {
    return { error: publicActionError(error, "No se pudo eliminar la foto.") };
  }

  if (input.storagePath) {
    await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).remove([input.storagePath]);
  }

  if (current?.is_cover) {
    const { data: remaining } = await supabase
      .from("vehicle_photos")
      .select("id")
      .eq("vehicle_id", input.vehicleId)
      .order("sort_order", { ascending: true })
      .limit(1);
    const nextCover = remaining?.[0];
    if (nextCover) {
      await supabase.from("vehicle_photos").update({ is_cover: true }).eq("id", nextCover.id);
    }
  }

  revalidateVehicles(input.vehicleId);
  return { error: null };
}

export async function deleteVehicle(vehicleId: string) {
  await requireAdmin();
  if (!UUID_RE.test(vehicleId)) {
    return { error: "Vehículo inválido." };
  }

  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("vehicle_photos")
    .select("storage_path")
    .eq("vehicle_id", vehicleId);

  const { data: listed } = await supabase.storage.from(VEHICLE_PHOTOS_BUCKET).list(vehicleId, {
    limit: 100,
  });

  const storagePaths = mergeVehicleStoragePaths(
    vehicleId,
    (photos ?? []).map((photo) => String(photo.storage_path ?? "")),
    (listed ?? []).map((entry) => entry.name),
  );

  const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
  if (error) {
    return { error: publicActionError(error, "No se pudo eliminar el vehículo.") };
  }

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .remove(storagePaths);
    if (storageError) {
      revalidateVehicles();
      return {
        error: "El vehículo se eliminó, pero algunas fotos quedaron en Storage. Revisa el bucket.",
      };
    }
  }

  revalidateVehicles();
  return { error: null };
}
