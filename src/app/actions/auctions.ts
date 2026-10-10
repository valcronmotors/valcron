"use server";

import { revalidatePath, updateTag } from "next/cache";
import { publicActionError } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/auth";
import {
  mergeAuctionMetadata,
  readAuctionMetadata,
  type AuctionAdminMetadata,
  type AuctionAdminPriceMode,
} from "@/lib/auction-admin-fields";
import { opportunityToVehicleDraft } from "@/lib/auctions/prepare-website";
import { type LinkedVehicleSummary } from "@/lib/auctions/opportunity-admin";
import {
  isMissingPublicPriceModeColumn,
  omitPublicPriceModeColumn,
} from "@/lib/public-price-mode";
import { parseAuctionSourceUrl } from "@/lib/auctions/url";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { PUBLIC_INVENTORY_CACHE_TAG } from "@/lib/public-cache";
import {
  findOpportunityByCopartLot,
  getCopartLot,
  lookupCopartLotAction,
  type CopartLotLookupActionResult,
} from "@/app/actions/copart";
import { setVehiclePublished } from "@/app/actions/vehicles";
import { COPART_DUPLICATE_LOT_MESSAGE, copartOpportunityInsert } from "@/lib/auction-providers/copart/opportunity";
import { COPART_LOOKUP_SUCCESS_MESSAGE } from "@/lib/auction-providers/copart/lookup";
import { normalizeCopartLotNumber } from "@/lib/auction-providers/copart/urls";
import { auctionPublicationBlockMessage } from "@/lib/auctions/auction-publication";
import {
  isAuctionProvider,
  type AuctionOpportunityRow,
  type AuctionOpportunityStatus,
  type AuctionProvider,
  AUCTION_OPPORTUNITY_STATUSES,
} from "@/lib/website-schema";
import { createClient } from "@/utils/supabase/server";
import { buildVehicleSlug, vehiclePath } from "@/lib/vehicles/vehicle-slugs";

export type AuctionActionState = {
  error: string | null;
  success?: string | null;
  id?: string;
  vehicleId?: string;
  publicPath?: string | null;
  parsed?: {
    provider: AuctionProvider;
    providerLotId: string | null;
    sourceUrl: string;
  };
  lookup?: CopartLotLookupActionResult;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function intOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.round(value) : null;
}

function floatOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim().replace(/,/g, "");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function revalidateAuctions(id?: string) {
  revalidatePath("/admin/subastas");
  revalidatePath("/admin");
  revalidatePath("/subastas");
  if (id) {
    revalidatePath(`/admin/subastas/${id}`);
  }
  try {
    updateTag(PUBLIC_INVENTORY_CACHE_TAG);
  } catch {
    /* tag API may be unavailable in some runtimes */
  }
}

export async function parseAuctionUrlAction(
  _prev: AuctionActionState | null,
  formData: FormData,
): Promise<AuctionActionState> {
  await requireAdmin();
  const parsed = parseAuctionSourceUrl(String(formData.get("source_url") ?? ""));
  if (!parsed.data) {
    return { error: parsed.error };
  }
  let lookup: CopartLotLookupActionResult | undefined;
  if (parsed.data.provider === "copart" && parsed.data.providerLotId) {
    lookup = await lookupCopartLotAction(parsed.data.providerLotId);
  }
  const lotFound = lookup?.status === "found";
  return {
    error: lookup?.status === "error" ? lookup.error : null,
    parsed: {
      provider: parsed.data.provider,
      providerLotId: lookup?.lot ?? parsed.data.providerLotId,
      sourceUrl: lookup?.sourceUrl ?? parsed.data.sourceUrl,
    },
    lookup,
    success: lotFound
      ? COPART_LOOKUP_SUCCESS_MESSAGE
      : parsed.data.providerLotId
        ? "Detectamos el proveedor y el número de lote. Revisa y completa la información antes de guardar."
        : "Detectamos el proveedor. Completa el número de lote y el resto de los datos antes de guardar.",
  };
}

function parseMetadata(formData: FormData): AuctionAdminMetadata {
  const priceModeRaw = String(formData.get("price_mode") ?? "contact").trim();
  const priceMode: AuctionAdminPriceMode = priceModeRaw === "buy_now" ? "buy_now" : "contact";
  const buyNow = floatOrNull(formData, "buy_now_usd");
  const mileageUnit = String(formData.get("mileage_unit") ?? "mi").trim();
  return {
    secondary_damage: text(formData, "secondary_damage"),
    run_and_drive: text(formData, "run_and_drive"),
    keys: text(formData, "keys"),
    odometer_status: text(formData, "odometer_status"),
    body_style: text(formData, "body_style"),
    fuel: text(formData, "fuel"),
    transmission: text(formData, "transmission"),
    drivetrain: text(formData, "drivetrain"),
    engine: text(formData, "engine"),
    exterior_color: text(formData, "exterior_color"),
    interior_color: text(formData, "interior_color"),
    mileage_unit: mileageUnit === "km" ? "km" : "mi",
    description: text(formData, "description"),
    auction_sale_status: text(formData, "auction_sale_status"),
    city: text(formData, "city"),
    state: text(formData, "state"),
    auction_date: text(formData, "auction_date"),
    seller_type: text(formData, "seller_type"),
    price_mode: priceMode,
    buy_now_usd: priceMode === "buy_now" ? buyNow : null,
    video_url: text(formData, "video_url"),
    featured: String(formData.get("featured") ?? "") === "true" || String(formData.get("featured") ?? "") === "on",
  };
}

function parseOpportunity(formData: FormData) {
  const providerRaw = String(formData.get("provider") ?? "other");
  const provider = isAuctionProvider(providerRaw) ? providerRaw : null;
  const vin = text(formData, "vin")?.toUpperCase() ?? null;
  const year = intOrNull(formData, "year");
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!provider) {
    return { data: null, error: "Selecciona una casa de subasta.", metadata: null };
  }
  if (provider !== "copart" && provider !== "iaa" && provider !== "manheim" && provider !== "other") {
    return { data: null, error: "Selecciona Copart, IAA o Manheim.", metadata: null };
  }
  const sourceUrl = text(formData, "source_url");
  if (sourceUrl && !isSafeHttpUrl(sourceUrl)) {
    return { data: null, error: "El enlace de origen debe comenzar con http:// o https://.", metadata: null };
  }
  if (vin && !VIN_RE.test(vin)) {
    return { data: null, error: "El VIN debe tener 17 caracteres válidos.", metadata: null };
  }
  if (
    statusRaw &&
    !(AUCTION_OPPORTUNITY_STATUSES as readonly string[]).includes(statusRaw)
  ) {
    return { data: null, error: "Estado de oportunidad inválido.", metadata: null };
  }

  const metadata = parseMetadata(formData);
  if (metadata.price_mode === "buy_now" && (metadata.buy_now_usd == null || metadata.buy_now_usd <= 0)) {
    return {
      data: null,
      error: "Ingresa el monto Buy Now verificado en USD, o elige Precio a consultar.",
      metadata: null,
    };
  }
  if (metadata.video_url && !isSafeHttpUrl(metadata.video_url)) {
    return { data: null, error: "El enlace de video debe comenzar con http:// o https://.", metadata: null };
  }

  return {
    data: {
      provider,
      provider_lot_id: text(formData, "provider_lot_id"),
      source_url: sourceUrl,
      vin,
      year,
      make: text(formData, "make"),
      model: text(formData, "model"),
      trim: text(formData, "trim"),
      mileage: intOrNull(formData, "mileage"),
      title_status: text(formData, "title_status"),
      primary_damage: text(formData, "primary_damage"),
      location: text(formData, "location") || [metadata.city, metadata.state].filter(Boolean).join(", ") || null,
      internal_notes: text(formData, "internal_notes"),
      ...(statusRaw ? { status: statusRaw as AuctionOpportunityStatus } : {}),
    },
    metadata,
    error: null as string | null,
  };
}

async function findDuplicateLot(
  provider: AuctionProvider,
  lotId: string | null,
  currentId?: string,
) {
  if (!lotId?.trim()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("auction_opportunities")
    .select("id")
    .eq("provider", provider)
    .eq("provider_lot_id", lotId.trim())
    .maybeSingle();
  if (data?.id && data.id !== currentId) {
    return data.id as string;
  }
  return null;
}

async function copartPayloadForSave(
  data: NonNullable<ReturnType<typeof parseOpportunity>["data"]>,
  currentId?: string,
) {
  if (data.provider !== "copart") {
    return { payload: data, metadata: null as Record<string, unknown> | null, duplicate: null as string | null };
  }
  const lot = normalizeCopartLotNumber(data.provider_lot_id);
  if (!lot) {
    return { payload: data, metadata: null, duplicate: null as string | null };
  }
  const existing = await findOpportunityByCopartLot(lot);
  if (existing.id && existing.id !== currentId) {
    return { payload: data, metadata: null, duplicate: existing.id };
  }
  const cached = await getCopartLot(lot);
  if (!cached.vehicle) {
    return {
      payload: { ...data, provider_lot_id: lot },
      metadata: null,
      duplicate: null as string | null,
    };
  }
  const mapped = copartOpportunityInsert(cached.vehicle, { imageUrls: cached.gallery });
  return {
    payload: {
      ...data,
      provider_lot_id: mapped.provider_lot_id,
      source_url: data.source_url || mapped.source_url,
    },
    metadata: mapped.auction_metadata as Record<string, unknown>,
    duplicate: null as string | null,
  };
}

async function syncLinkedVehicle(
  opportunity: AuctionOpportunityRow,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const draft = opportunityToVehicleDraft(opportunity);
  if (!draft.data) {
    return { vehicleId: opportunity.linked_vehicle_id, error: draft.error };
  }

  if (opportunity.linked_vehicle_id) {
    const patch = {
      vin: draft.data.vin,
      year: draft.data.year,
      make: draft.data.make,
      model: draft.data.model,
      trim: draft.data.trim,
      mileage: draft.data.mileage,
      mileage_unit: draft.data.mileage_unit,
      exterior_color: draft.data.exterior_color,
      interior_color: draft.data.interior_color,
      engine: draft.data.engine,
      transmission: draft.data.transmission,
      drivetrain: draft.data.drivetrain,
      fuel: draft.data.fuel,
      title_status: draft.data.title_status,
      condition: draft.data.condition,
      location: draft.data.location,
      public_price_mode: draft.data.public_price_mode,
      featured: draft.data.featured,
      description: draft.data.description,
      price: draft.data.price,
      stock_number: draft.data.stock_number,
      source_type: "other" as const,
    };
    let { error } = await supabase.from("vehicles").update(patch).eq("id", opportunity.linked_vehicle_id);
    if (error && isMissingPublicPriceModeColumn(error)) {
      ({ error } = await supabase
        .from("vehicles")
        .update(omitPublicPriceModeColumn(patch as unknown as Record<string, unknown>))
        .eq("id", opportunity.linked_vehicle_id));
    }
    if (error) {
      return { vehicleId: opportunity.linked_vehicle_id, error: publicActionError(error, "No se pudo sincronizar el vehículo.") };
    }
    revalidatePath(`/admin/inventario/${opportunity.linked_vehicle_id}`);
    return { vehicleId: opportunity.linked_vehicle_id, error: null as string | null };
  }

  return { vehicleId: null as string | null, error: null as string | null };
}

export async function createAuctionOpportunity(
  _prev: AuctionActionState | null,
  formData: FormData,
): Promise<AuctionActionState> {
  await requireAdmin();
  const parsed = parseOpportunity(formData);
  if (!parsed.data || !parsed.metadata) {
    return { error: parsed.error };
  }

  const duplicate = await findDuplicateLot(parsed.data.provider, parsed.data.provider_lot_id);
  if (duplicate) {
    return { error: "Este lote ya está en tus oportunidades.", id: duplicate };
  }

  const supabase = await createClient();
  const { payload, metadata: copartMeta, duplicate: copartDup } = await copartPayloadForSave(parsed.data);
  if (copartDup) {
    return { error: COPART_DUPLICATE_LOT_MESSAGE, id: copartDup };
  }

  const auction_metadata = mergeAuctionMetadata(copartMeta ?? {}, parsed.metadata);

  const { data, error } = await supabase
    .from("auction_opportunities")
    .insert({
      ...payload,
      status: parsed.data.status ?? "draft",
      auction_metadata,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: publicActionError(error, "No se pudo guardar la oportunidad.") };
  }

  revalidateAuctions(data.id);
  return { error: null, success: "Borrador guardado.", id: data.id };
}

export async function updateAuctionOpportunity(
  _prev: AuctionActionState | null,
  formData: FormData,
): Promise<AuctionActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!UUID_RE.test(id)) {
    return { error: "Oportunidad inválida." };
  }
  const parsed = parseOpportunity(formData);
  if (!parsed.data || !parsed.metadata) {
    return { error: parsed.error };
  }

  const duplicate = await findDuplicateLot(parsed.data.provider, parsed.data.provider_lot_id, id);
  if (duplicate) {
    return { error: "Este lote ya está en tus oportunidades.", id: duplicate };
  }

  const supabase = await createClient();
  const { data: existing, error: loadError } = await supabase
    .from("auction_opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError || !existing) {
    return { error: publicActionError(loadError, "Oportunidad no encontrada.") };
  }

  const { payload, metadata: copartMeta, duplicate: copartDup } = await copartPayloadForSave(parsed.data, id);
  if (copartDup) {
    return { error: COPART_DUPLICATE_LOT_MESSAGE, id: copartDup };
  }

  const auction_metadata = mergeAuctionMetadata(
    mergeAuctionMetadata((existing as AuctionOpportunityRow).auction_metadata, copartMeta ?? {}),
    parsed.metadata,
  );

  const { error } = await supabase
    .from("auction_opportunities")
    .update({ ...payload, auction_metadata })
    .eq("id", id);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la oportunidad.") };
  }

  const opportunity = {
    ...(existing as AuctionOpportunityRow),
    ...payload,
    auction_metadata,
  } as AuctionOpportunityRow;

  const sync = await syncLinkedVehicle(opportunity, supabase);
  if (sync.error) {
    return { error: sync.error, id };
  }

  revalidateAuctions(id);
  return { error: null, success: "Borrador guardado.", id, vehicleId: sync.vehicleId ?? undefined };
}

export async function prepareAuctionForWebsite(opportunityId: string): Promise<AuctionActionState> {
  await requireAdmin();
  if (!UUID_RE.test(opportunityId)) {
    return { error: "Oportunidad inválida." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auction_opportunities")
    .select("*")
    .eq("id", opportunityId)
    .maybeSingle();

  if (error || !data) {
    return { error: publicActionError(error, "Oportunidad no encontrada.") };
  }

  const opportunity = data as AuctionOpportunityRow;
  if (opportunity.linked_vehicle_id) {
    await syncLinkedVehicle(opportunity, supabase);
    return {
      error: null,
      success: "Vehículo de subasta listo.",
      id: opportunity.linked_vehicle_id,
      vehicleId: opportunity.linked_vehicle_id,
    };
  }

  const draft = opportunityToVehicleDraft(opportunity);
  if (!draft.data) {
    return { error: draft.error };
  }

  let { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .insert(draft.data)
    .select("id")
    .single();
  if (vehicleError && isMissingPublicPriceModeColumn(vehicleError)) {
    ({ data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert(omitPublicPriceModeColumn(draft.data as unknown as Record<string, unknown>))
      .select("id")
      .single());
  }

  if (vehicleError || !vehicle) {
    return { error: publicActionError(vehicleError, "No se pudo crear el borrador del vehículo.") };
  }

  const { data: linked, error: linkError } = await supabase
    .from("auction_opportunities")
    .update({
      linked_vehicle_id: vehicle.id,
      status: opportunity.status === "draft" ? "review" : opportunity.status,
    })
    .eq("id", opportunityId)
    .is("linked_vehicle_id", null)
    .select("linked_vehicle_id")
    .maybeSingle();

  if (linkError) {
    await supabase.from("vehicles").delete().eq("id", vehicle.id);
    return { error: publicActionError(linkError, "No se pudo vincular el vehículo.") };
  }

  if (!linked) {
    await supabase.from("vehicles").delete().eq("id", vehicle.id);
    const { data: existing } = await supabase
      .from("auction_opportunities")
      .select("linked_vehicle_id")
      .eq("id", opportunityId)
      .maybeSingle();
    return {
      error: null,
      success: "Esta oportunidad ya tiene un vehículo de subasta.",
      id: existing?.linked_vehicle_id ?? undefined,
      vehicleId: existing?.linked_vehicle_id ?? undefined,
    };
  }

  revalidatePath("/admin/inventario");
  revalidatePath(`/admin/inventario/${vehicle.id}`);
  revalidateAuctions(opportunityId);
  return {
    error: null,
    success: "Borrador de subasta listo. Continúa con fotos y publicación.",
    id: vehicle.id,
    vehicleId: vehicle.id,
  };
}

export async function publishAuctionOpportunity(opportunityId: string): Promise<AuctionActionState> {
  await requireAdmin();
  if (!UUID_RE.test(opportunityId)) {
    return { error: "Oportunidad inválida." };
  }

  const supabase = await createClient();
  const { data: opportunityRow, error: opportunityError } = await supabase
    .from("auction_opportunities")
    .select("*")
    .eq("id", opportunityId)
    .maybeSingle();
  if (opportunityError || !opportunityRow) {
    return { error: publicActionError(opportunityError, "Oportunidad no encontrada.") };
  }
  const opportunity = opportunityRow as AuctionOpportunityRow;
  const meta = readAuctionMetadata(opportunity.auction_metadata);

  const prepared = await prepareAuctionForWebsite(opportunityId);
  if (prepared.error || (!prepared.vehicleId && !prepared.id)) {
    return { error: prepared.error ?? "No se pudo preparar la oportunidad." };
  }
  const vehicleId = prepared.vehicleId ?? prepared.id!;

  const { data: vehicleFull, error: vehicleLookupError } = await supabase
    .from("vehicles")
    .select(
      "id, year, make, model, trim, status, published, published_at, source_type, vehicle_photos ( id, is_cover, storage_path )",
    )
    .eq("id", vehicleId)
    .maybeSingle();
  if (vehicleLookupError || !vehicleFull) {
    return { error: publicActionError(vehicleLookupError, "Vehículo de subasta no encontrado."), id: opportunityId };
  }

  const photos = (vehicleFull.vehicle_photos ?? []) as { id: string; is_cover: boolean; storage_path?: string | null }[];
  const hasCover = photos.some((photo) => photo.is_cover && photo.storage_path?.trim()) || photos.some((photo) => photo.storage_path?.trim());
  const blocked = auctionPublicationBlockMessage({
    provider: opportunity.provider,
    provider_lot_id: opportunity.provider_lot_id,
    year: opportunity.year ?? vehicleFull.year,
    make: opportunity.make ?? vehicleFull.make,
    model: opportunity.model ?? vehicleFull.model,
    location: opportunity.location,
    price_mode: meta.price_mode ?? "contact",
    buy_now_usd: meta.buy_now_usd,
    hasCoverPhoto: hasCover,
    photoCount: photos.length,
  });
  if (blocked) {
    return { error: blocked, id: opportunityId, vehicleId };
  }

  // Auction publish path: set available + published without local inventory status rules.
  const { data: updated, error: publishError } = await supabase
    .from("vehicles")
    .update({
      published: true,
      status: "available",
      source_type: "other",
      published_at: vehicleFull.published_at ?? new Date().toISOString(),
    })
    .eq("id", vehicleId)
    .select("id, published, year, make, model, trim")
    .maybeSingle();
  if (publishError || !updated?.published) {
    return {
      error: publicActionError(publishError, "No se pudo publicar la oportunidad de subasta."),
      id: opportunityId,
      vehicleId,
    };
  }

  await supabase.from("auction_opportunities").update({ status: "published" }).eq("id", opportunityId);
  revalidateAuctions(opportunityId);
  revalidatePath("/inventario");
  revalidatePath("/subastas");
  revalidatePath(`/inventario/${vehicleId}`);

  const slug = buildVehicleSlug({
    id: updated.id,
    year: updated.year,
    make: updated.make,
    model: updated.model,
    trim: updated.trim,
  });

  return {
    error: null,
    success: "Oportunidad publicada en el inventario de subastas.",
    id: opportunityId,
    vehicleId,
    publicPath: vehiclePath(slug),
  };
}

export async function unpublishAuctionOpportunity(opportunityId: string): Promise<AuctionActionState> {
  await requireAdmin();
  if (!UUID_RE.test(opportunityId)) {
    return { error: "Oportunidad inválida." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auction_opportunities")
    .select("id, linked_vehicle_id, status")
    .eq("id", opportunityId)
    .maybeSingle();
  if (error || !data) {
    return { error: publicActionError(error, "Oportunidad no encontrada.") };
  }
  if (data.linked_vehicle_id) {
    const result = await setVehiclePublished(data.linked_vehicle_id, false);
    if (result.error) {
      return { error: result.error, id: opportunityId };
    }
  }
  await supabase
    .from("auction_opportunities")
    .update({ status: data.status === "archived" ? "archived" : "review" })
    .eq("id", opportunityId);
  revalidateAuctions(opportunityId);
  return { error: null, success: "Oportunidad despublicada.", id: opportunityId };
}

export async function setAuctionOpportunityStatus(
  opportunityId: string,
  status: AuctionOpportunityStatus,
): Promise<AuctionActionState> {
  await requireAdmin();
  if (!UUID_RE.test(opportunityId) || !(AUCTION_OPPORTUNITY_STATUSES as readonly string[]).includes(status)) {
    return { error: "Oportunidad inválida." };
  }
  const supabase = await createClient();
  if (status === "archived") {
    const { data } = await supabase
      .from("auction_opportunities")
      .select("linked_vehicle_id")
      .eq("id", opportunityId)
      .maybeSingle();
    if (data?.linked_vehicle_id) {
      await setVehiclePublished(data.linked_vehicle_id, false);
    }
  }
  const { error } = await supabase.from("auction_opportunities").update({ status }).eq("id", opportunityId);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la oportunidad.") };
  }
  revalidateAuctions(opportunityId);
  return { error: null, success: "Oportunidad actualizada.", id: opportunityId };
}

export async function listAuctionOpportunities() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auction_opportunities")
    .select("*")
    .order("updated_at", { ascending: false });

  const opportunities = (data ?? []) as AuctionOpportunityRow[];
  const linkedIds = [
    ...new Set(opportunities.map((row) => row.linked_vehicle_id).filter((id): id is string => Boolean(id))),
  ];
  const linked = new Map<string, LinkedVehicleSummary>();
  if (linkedIds.length) {
    const withPriceMode = await supabase
      .from("vehicles")
      .select(
        "id, published, status, year, make, model, description, price, public_price_mode, source_type, vehicle_photos ( id, is_cover, storage_path )",
      )
      .in("id", linkedIds);
    const linkedVehicles =
      withPriceMode.error && isMissingPublicPriceModeColumn(withPriceMode.error)
        ? await supabase
            .from("vehicles")
            .select(
              "id, published, status, year, make, model, description, price, source_type, vehicle_photos ( id, is_cover, storage_path )",
            )
            .in("id", linkedIds)
        : withPriceMode;
    for (const row of (linkedVehicles.data ?? []) as LinkedVehicleSummary[]) {
      linked.set(row.id, row);
    }
  }

  return {
    opportunities: opportunities.map((row) => ({
      ...row,
      linked_vehicle: row.linked_vehicle_id ? linked.get(row.linked_vehicle_id) ?? null : null,
    })),
    error: error ? publicActionError(error, "No pudimos cargar las oportunidades.") : null,
  };
}

export async function getAuctionOpportunity(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auction_opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const opportunity = (data ?? null) as AuctionOpportunityRow | null;
  let linkedVehicle: (LinkedVehicleSummary & { vehicle_photos?: LinkedVehicleSummary["vehicle_photos"] }) | null =
    null;

  if (opportunity?.linked_vehicle_id) {
    const withPriceMode = await supabase
      .from("vehicles")
      .select(
        "id, published, status, year, make, model, description, price, public_price_mode, source_type, vehicle_photos ( id, is_cover, storage_path, sort_order, alt_text )",
      )
      .eq("id", opportunity.linked_vehicle_id)
      .maybeSingle();
    linkedVehicle = (withPriceMode.data as typeof linkedVehicle) ?? null;
  }

  return {
    opportunity,
    linkedVehicle,
    meta: opportunity ? readAuctionMetadata(opportunity.auction_metadata) : null,
    error: error ? publicActionError(error, "No pudimos cargar la oportunidad.") : null,
  };
}
