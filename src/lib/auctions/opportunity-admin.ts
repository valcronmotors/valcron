import { copartCardImageUrl } from "@/lib/auction-providers/copart/images";
import { AUCTION_STATUS_LABEL } from "@/lib/admin-copy";
import { readAuctionMetadata } from "@/lib/auction-admin-fields";
import { canPublishAuctionOpportunity, auctionPublicationChecks } from "@/lib/auctions/auction-publication";
import type { PublicPriceMode } from "@/lib/public-price-mode";
import { isSafeHttpUrl } from "@/lib/safe-url";
import { vehicleImageAdminPath } from "@/lib/storage";
import type {
  AuctionOpportunityRow,
  AuctionOpportunityStatus,
  AuctionProvider,
  VehicleSourceType,
  VehicleStatus,
} from "@/lib/website-schema";

export const ACTIVE_AUCTION_PROVIDERS = ["copart", "iaa", "manheim"] as const;
export type ActiveAuctionProvider = (typeof ACTIVE_AUCTION_PROVIDERS)[number];

export const ACTIVE_PROVIDER_FILTERS = [
  { id: "all" as const, label: "Todas" },
  { id: "copart" as const, label: "Copart" },
  { id: "iaa" as const, label: "IAA" },
  { id: "manheim" as const, label: "Manheim" },
];

export const OPPORTUNITY_STATUS_FILTERS = [
  { id: "all" as const, label: "Todos los estados" },
  { id: "draft" as const, label: AUCTION_STATUS_LABEL.draft },
  { id: "review" as const, label: AUCTION_STATUS_LABEL.review },
  { id: "published" as const, label: AUCTION_STATUS_LABEL.published },
  { id: "archived" as const, label: AUCTION_STATUS_LABEL.archived },
];

export type OpportunityWebsiteState = "unprepared" | "draft" | "ready" | "published";

export const OPPORTUNITY_WEBSITE_STATE_LABEL: Record<OpportunityWebsiteState, string> = {
  unprepared: "No preparado",
  draft: "Borrador",
  ready: "Listo para publicar",
  published: "Publicado",
};

export type LinkedVehicleSummary = {
  id: string;
  published: boolean;
  status: VehicleStatus;
  year: number | null;
  make: string | null;
  model: string | null;
  description: string | null;
  price: number | null;
  public_price_mode?: PublicPriceMode | null;
  source_type: VehicleSourceType;
  vehicle_photos?: { id: string; is_cover: boolean; storage_path?: string | null }[] | null;
};

export function isActiveAuctionProvider(value: string | null | undefined): value is ActiveAuctionProvider {
  return value === "copart" || value === "iaa" || value === "manheim";
}

export function activeAuctionProviderChoices(current?: AuctionProvider | null) {
  const choices: { id: AuctionProvider; label: string }[] = [
    { id: "copart", label: "Copart" },
    { id: "iaa", label: "IAA" },
    { id: "manheim", label: "Manheim" },
  ];
  if (current === "other") {
    choices.push({ id: "other", label: "Otro" });
  }
  return choices;
}

/** Manheim is allowed for new manual opportunities (V26). */
export function newOpportunityRejectsManheim(provider: AuctionProvider, isUpdate: boolean) {
  void provider;
  void isUpdate;
  return false;
}

export function remapNewOpportunityProvider(provider: AuctionProvider): AuctionProvider {
  return provider;
}

export function opportunityCountLabel(count: number) {
  return count === 1 ? "1 oportunidad" : `${count} oportunidades`;
}

export function opportunityStatusMetrics(
  rows: Array<Pick<AuctionOpportunityRow, "status">>,
): Record<AuctionOpportunityStatus, number> {
  const counts: Record<AuctionOpportunityStatus, number> = {
    draft: 0,
    review: 0,
    published: 0,
    archived: 0,
  };
  for (const row of rows) {
    if (row.status in counts) {
      counts[row.status] += 1;
    }
  }
  return counts;
}

/** Publication metrics from linked website state (not invented). */
export function opportunityPublicationMetrics(
  rows: Array<AuctionOpportunityRow & { linked_vehicle?: LinkedVehicleSummary | null }>,
) {
  let publicados = 0;
  let borradores = 0;
  let enRevision = 0;
  let archivados = 0;

  for (const row of rows) {
    if (row.status === "archived") {
      archivados += 1;
      continue;
    }
    const website = opportunityWebsiteState(row, row.linked_vehicle);
    if (website === "published" || row.status === "published") {
      publicados += 1;
    } else if (row.status === "review" || website === "ready") {
      enRevision += 1;
    } else {
      borradores += 1;
    }
  }

  return { publicados, borradores, enRevision, archivados };
}

export function formatAuctionDisplayName(value: string | null | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (/[a-z]/.test(raw) && /[A-Z]/.test(raw) && !/^[A-Z0-9\s-]+$/.test(raw)) {
    return raw;
  }
  return raw
    .split(/\s+/)
    .map((word) => formatAuctionToken(word))
    .join(" ");
}

function formatAuctionToken(word: string) {
  const parts = word.split("-").filter(Boolean);
  if (parts.length > 1 && parts.every((part) => part.length <= 3 && !/\d/.test(part))) {
    return parts.map((part) => part.toUpperCase()).join("-");
  }
  return parts
    .map((part) => {
      if (/\d/.test(part)) return part.toUpperCase();
      if (part.length <= 3) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("-");
}

export function opportunityVehicleTitle(row: Pick<AuctionOpportunityRow, "year" | "make" | "model">) {
  const year = row.year ? String(row.year) : "";
  const make = formatAuctionDisplayName(row.make);
  const model = formatAuctionDisplayName(row.model);
  const title = [year, make, model].filter(Boolean).join(" ");
  return title || "Completar datos";
}

export function opportunityVehicleTrim(row: Pick<AuctionOpportunityRow, "trim">) {
  return formatAuctionDisplayName(row.trim);
}

export function opportunityThumbnailUrl(
  row: Pick<AuctionOpportunityRow, "provider" | "auction_metadata"> & {
    linked_vehicle?: LinkedVehicleSummary | null;
  },
) {
  const cover = row.linked_vehicle?.vehicle_photos?.find((photo) => photo.is_cover)
    ?? row.linked_vehicle?.vehicle_photos?.[0];
  if (cover?.storage_path) {
    return vehicleImageAdminPath(String(cover.storage_path));
  }
  if (row.provider !== "copart") return null;
  const meta = row.auction_metadata ?? {};
  const thumbnail = typeof meta.thumbnailUrl === "string" ? meta.thumbnailUrl : null;
  const imageReference = typeof meta.imageReference === "string" ? meta.imageReference : null;
  return copartCardImageUrl(thumbnail, imageReference);
}

export function opportunityWebsiteState(
  row: Pick<AuctionOpportunityRow, "linked_vehicle_id"> &
    Partial<
      Pick<
        AuctionOpportunityRow,
        | "provider"
        | "provider_lot_id"
        | "year"
        | "make"
        | "model"
        | "location"
        | "auction_metadata"
        | "vin"
        | "title_status"
        | "primary_damage"
      >
    >,
  vehicle?: LinkedVehicleSummary | null,
): OpportunityWebsiteState {
  if (!row.linked_vehicle_id) return "unprepared";
  if (!vehicle) return "draft";
  if (vehicle.published) return "published";
  const meta = readAuctionMetadata(row.auction_metadata);
  const photos = vehicle.vehicle_photos ?? [];
  const ready = canPublishAuctionOpportunity(
    auctionPublicationChecks({
      provider: row.provider ?? "other",
      provider_lot_id: row.provider_lot_id ?? "pending",
      year: row.year ?? vehicle.year,
      make: row.make ?? vehicle.make,
      model: row.model ?? vehicle.model,
      location: row.location,
      price_mode: meta.price_mode ?? (vehicle.public_price_mode === "fixed" ? "buy_now" : "contact"),
      buy_now_usd: meta.buy_now_usd ?? (vehicle.public_price_mode === "fixed" ? vehicle.price : null),
      hasCoverPhoto: photos.some((photo) => photo.is_cover) || photos.length > 0,
      photoCount: photos.length,
      vin: row.vin,
      title_status: row.title_status,
      odometer_status: meta.odometer_status,
      primary_damage: row.primary_damage,
      secondary_damage: meta.secondary_damage,
      run_and_drive: meta.run_and_drive,
    }),
  );
  return ready ? "ready" : "draft";
}

export function opportunityMatchesQuery(
  row: Pick<AuctionOpportunityRow, "year" | "make" | "model" | "trim" | "vin" | "provider_lot_id">,
  query: string,
) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [
    row.year,
    row.make,
    row.model,
    row.trim,
    row.vin,
    row.provider_lot_id,
    opportunityVehicleTitle(row),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function filterOpportunities<T extends AuctionOpportunityRow>(
  rows: T[],
  input: {
    provider?: "all" | ActiveAuctionProvider;
    status?: "all" | AuctionOpportunityStatus;
    query?: string;
    make?: string;
    model?: string;
    year?: string | number | null;
    priceMode?: "all" | "contact" | "buy_now";
    auctionStatus?: string;
  },
) {
  const provider = input.provider ?? "all";
  const status = input.status ?? "all";
  const make = (input.make ?? "").trim().toLowerCase();
  const model = (input.model ?? "").trim().toLowerCase();
  const year = input.year != null && String(input.year).trim() ? String(input.year).trim() : "";
  const priceMode = input.priceMode ?? "all";
  const auctionStatus = (input.auctionStatus ?? "").trim().toLowerCase();

  return rows.filter((row) => {
    if (provider !== "all" && row.provider !== provider) return false;
    if (status !== "all" && row.status !== status) return false;
    if (make && !(row.make ?? "").toLowerCase().includes(make)) return false;
    if (model && !(row.model ?? "").toLowerCase().includes(model)) return false;
    if (year && String(row.year ?? "") !== year) return false;
    const meta = readAuctionMetadata(row.auction_metadata);
    if (priceMode !== "all" && (meta.price_mode ?? "contact") !== priceMode) return false;
    if (auctionStatus && (meta.auction_sale_status ?? "").toLowerCase() !== auctionStatus) return false;
    return opportunityMatchesQuery(row, input.query ?? "");
  });
}

export type OpportunityOverflowActionId =
  | "view"
  | "edit"
  | "preview"
  | "publish"
  | "unpublish"
  | "archive"
  | "delete"
  | "source";

/** Hard deletion is limited to unpublished, unlinked opportunities.
 * Linked website vehicles must be handled through the existing archive/unpublish workflow.
 */
export function canDeleteAuctionOpportunity(
  row: Pick<AuctionOpportunityRow, "linked_vehicle_id" | "status">,
) {
  return !row.linked_vehicle_id && row.status !== "published";
}

export function opportunityOverflowActions(
  row: Pick<AuctionOpportunityRow, "id" | "source_url" | "linked_vehicle_id" | "status">,
  vehicle?: LinkedVehicleSummary | null,
) {
  const website = opportunityWebsiteState(row, vehicle);
  const actions: {
    id: OpportunityOverflowActionId;
    label: string;
    href?: string;
    target?: string;
    danger?: boolean;
  }[] = [
    { id: "view", label: "Ver oportunidad", href: `/admin/subastas/${row.id}` },
    { id: "edit", label: "Editar", href: `/admin/subastas/${row.id}` },
  ];

  if (row.linked_vehicle_id) {
    actions.push({
      id: "preview",
      label: "Vista previa",
      href: `/admin/subastas/${row.id}?paso=4`,
    });
  }

  if (website === "published") {
    actions.push({ id: "unpublish", label: "Despublicar" });
  } else if (row.status !== "archived") {
    actions.push({ id: "publish", label: "Publicar" });
  }

  if (row.source_url && isSafeHttpUrl(row.source_url)) {
    actions.push({ id: "source", label: "Abrir lote original", href: row.source_url, target: "_blank" });
  }

  if (row.status !== "archived") {
    actions.push({ id: "archive", label: "Archivar", danger: true });
  }
  if (canDeleteAuctionOpportunity(row)) {
    actions.push({ id: "delete", label: "Eliminar definitivamente", danger: true });
  }

  return actions;
}

export function providerFilterFromParam(value: string | null | undefined): "all" | ActiveAuctionProvider {
  return isActiveAuctionProvider(value) ? value : "all";
}

export function historicalProviderLabel(provider: AuctionProvider) {
  if (provider === "copart") return "Copart";
  if (provider === "iaa") return "IAA";
  if (provider === "manheim") return "Manheim";
  return "Otro";
}
