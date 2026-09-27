"use server";

import { revalidatePath } from "next/cache";
import { publicActionError } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/auth";
import { opportunityToVehicleDraft } from "@/lib/auctions/prepare-website";
import { newOpportunityRejectsManheim, type LinkedVehicleSummary } from "@/lib/auctions/opportunity-admin";
import { isMissingPublicPriceModeColumn, omitPublicPriceModeColumn } from "@/lib/public-price-mode";
import { parseAuctionSourceUrl } from "@/lib/auctions/url";
import { isSafeHttpUrl } from "@/lib/safe-url";
import {
  findOpportunityByCopartLot,
  getCopartLot,
  lookupCopartLotAction,
  type CopartLotLookupActionResult,
} from "@/app/actions/copart";
import { COPART_DUPLICATE_LOT_MESSAGE, copartOpportunityInsert } from "@/lib/auction-providers/copart/opportunity";
import { COPART_LOOKUP_SUCCESS_MESSAGE } from "@/lib/auction-providers/copart/lookup";
import { normalizeCopartLotNumber } from "@/lib/auction-providers/copart/urls";
import {
  isAuctionProvider,
  type AuctionOpportunityRow,
  type AuctionOpportunityStatus,
  type AuctionProvider,
  AUCTION_OPPORTUNITY_STATUSES,
} from "@/lib/website-schema";
import { createClient } from "@/utils/supabase/server";

export type AuctionActionState = {
  error: string | null;
  success?: string | null;
  id?: string;
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

function revalidateAuctions(id?: string) {
  revalidatePath("/admin/subastas");
  revalidatePath("/admin");
  if (id) {
    revalidatePath(`/admin/subastas/${id}`);
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

function parseOpportunity(formData: FormData) {
  const providerRaw = String(formData.get("provider") ?? "other");
  const provider = isAuctionProvider(providerRaw) ? providerRaw : null;
  const vin = text(formData, "vin")?.toUpperCase() ?? null;
  const year = intOrNull(formData, "year");
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!provider) {
    return { data: null, error: "Selecciona un proveedor." };
  }
  const sourceUrl = text(formData, "source_url");
  if (sourceUrl && !isSafeHttpUrl(sourceUrl)) {
    return { data: null, error: "El enlace de origen debe comenzar con http:// o https://." };
  }
  if (vin && !VIN_RE.test(vin)) {
    return { data: null, error: "El VIN debe tener 17 caracteres válidos." };
  }
  if (
    statusRaw &&
    !(AUCTION_OPPORTUNITY_STATUSES as readonly string[]).includes(statusRaw)
  ) {
    return { data: null, error: "Estado de oportunidad inválido." };
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
      location: text(formData, "location"),
      internal_notes: text(formData, "internal_notes"),
      ...(statusRaw ? { status: statusRaw as AuctionOpportunityStatus } : {}),
    },
    error: null as string | null,
  };
}

async function copartPayloadForSave(
  data: NonNullable<ReturnType<typeof parseOpportunity>["data"]>,
  currentId?: string,
) {
  if (data.provider !== "copart") {
    return { payload: data, metadata: currentId ? null : ({} as Record<string, unknown>), duplicate: null as string | null };
  }
  const lot = normalizeCopartLotNumber(data.provider_lot_id);
  if (!lot) {
    return { payload: data, metadata: currentId ? null : {}, duplicate: null as string | null };
  }
  const existing = await findOpportunityByCopartLot(lot);
  if (existing.id && existing.id !== currentId) {
    return { payload: data, metadata: null, duplicate: existing.id };
  }
  const cached = await getCopartLot(lot);
  if (!cached.vehicle) {
    return {
      payload: { ...data, provider_lot_id: lot },
      metadata: currentId ? null : {},
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
    metadata: mapped.auction_metadata,
    duplicate: null as string | null,
  };
}

export async function createAuctionOpportunity(
  _prev: AuctionActionState | null,
  formData: FormData,
): Promise<AuctionActionState> {
  await requireAdmin();
  const parsed = parseOpportunity(formData);
  if (!parsed.data) {
    return { error: parsed.error };
  }
  if (newOpportunityRejectsManheim(parsed.data.provider, false)) {
    return { error: "Manheim no está disponible para nuevas oportunidades." };
  }

  const supabase = await createClient();
  const { payload, metadata, duplicate } = await copartPayloadForSave(parsed.data);
  if (duplicate) {
    return { error: COPART_DUPLICATE_LOT_MESSAGE, id: duplicate };
  }

  const { data, error } = await supabase
    .from("auction_opportunities")
    .insert({
      ...payload,
      auction_metadata: metadata ?? {},
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: publicActionError(error, "No se pudo guardar la oportunidad.") };
  }

  revalidateAuctions(data.id);
  return { error: null, success: "Oportunidad guardada.", id: data.id };
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
  if (!parsed.data) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { payload, metadata, duplicate } = await copartPayloadForSave(parsed.data, id);
  if (duplicate) {
    return { error: COPART_DUPLICATE_LOT_MESSAGE, id: duplicate };
  }

  const { error } = await supabase
    .from("auction_opportunities")
    .update(metadata != null ? { ...payload, auction_metadata: metadata } : payload)
    .eq("id", id);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la oportunidad.") };
  }
  revalidateAuctions(id);
  return { error: null, success: "Oportunidad actualizada.", id };
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
    return {
      error: null,
      success: "Esta oportunidad ya tiene un vehículo en el inventario.",
      id: opportunity.linked_vehicle_id,
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
      success: "Esta oportunidad ya tiene un vehículo en el inventario.",
      id: existing?.linked_vehicle_id ?? undefined,
    };
  }

  revalidatePath("/admin/inventario");
  revalidatePath(`/admin/inventario/${vehicle.id}`);
  revalidateAuctions(opportunityId);
  return {
    error: null,
    success: "Borrador creado. Completa fotos, modo de precio y descripción antes de publicar.",
    id: vehicle.id,
  };
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
        "id, published, status, year, make, model, description, price, public_price_mode, source_type, vehicle_photos ( id, is_cover )",
      )
      .in("id", linkedIds);
    const linkedVehicles =
      withPriceMode.error && isMissingPublicPriceModeColumn(withPriceMode.error)
        ? await supabase
            .from("vehicles")
            .select(
              "id, published, status, year, make, model, description, price, source_type, vehicle_photos ( id, is_cover )",
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

  return {
    opportunity: (data ?? null) as AuctionOpportunityRow | null,
    error: error ? publicActionError(error, "No pudimos cargar la oportunidad.") : null,
  };
}
