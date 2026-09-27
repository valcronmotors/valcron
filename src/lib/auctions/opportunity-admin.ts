import { copartCardImageUrl } from "@/lib/auction-providers/copart/images";
import { AUCTION_STATUS_LABEL } from "@/lib/admin-copy";
import { canPublishVehicleListing, vehiclePublicationChecks } from "@/lib/publication-readiness";
import type { PublicPriceMode } from "@/lib/public-price-mode";
import { isSafeHttpUrl } from "@/lib/safe-url";
import type {
  AuctionOpportunityRow,
  AuctionOpportunityStatus,
  AuctionProvider,
  VehicleSourceType,
  VehicleStatus,
} from "@/lib/website-schema";

export const ACTIVE_AUCTION_PROVIDERS = ["copart", "iaa"] as const;
export type ActiveAuctionProvider = (typeof ACTIVE_AUCTION_PROVIDERS)[number];

export const ACTIVE_PROVIDER_FILTERS = [
  { id: "all" as const, label: "Todas" },
  { id: "copart" as const, label: "Copart" },
  { id: "iaa" as const, label: "IAA" },
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
  draft: "Borrador creado",
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
  vehicle_photos?: { id: string; is_cover: boolean }[] | null;
};

export function isActiveAuctionProvider(value: string | null | undefined): value is ActiveAuctionProvider {
  return value === "copart" || value === "iaa";
}

export function activeAuctionProviderChoices(current?: AuctionProvider | null) {
  const choices: { id: AuctionProvider; label: string }[] = [
    { id: "copart", label: "Copart" },
    { id: "iaa", label: "IAA — ingreso manual" },
  ];
  if (current === "manheim") {
    choices.push({ id: "manheim", label: "Manheim" });
  }
  if (current === "other") {
    choices.push({ id: "other", label: "Otro" });
  }
  return choices;
}

export function newOpportunityRejectsManheim(provider: AuctionProvider, isUpdate: boolean) {
  return !isUpdate && provider === "manheim";
}

export function remapNewOpportunityProvider(provider: AuctionProvider): AuctionProvider {
  return provider === "manheim" ? "other" : provider;
}

export function opportunityCountLabel(count: number) {
  return count === 1 ? "1 oportunidad" : `${count} oportunidades`;
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

export function opportunityThumbnailUrl(row: Pick<AuctionOpportunityRow, "provider" | "auction_metadata">) {
  if (row.provider !== "copart") return null;
  const meta = row.auction_metadata ?? {};
  const thumbnail = typeof meta.thumbnailUrl === "string" ? meta.thumbnailUrl : null;
  const imageReference = typeof meta.imageReference === "string" ? meta.imageReference : null;
  return copartCardImageUrl(thumbnail, imageReference);
}

export function opportunityWebsiteState(
  row: Pick<AuctionOpportunityRow, "linked_vehicle_id">,
  vehicle?: LinkedVehicleSummary | null,
): OpportunityWebsiteState {
  if (!row.linked_vehicle_id) return "unprepared";
  if (!vehicle) return "draft";
  if (vehicle.published) return "published";
  const ready = canPublishVehicleListing(
    vehiclePublicationChecks({
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      description: vehicle.description,
      price: vehicle.price,
      public_price_mode: vehicle.public_price_mode,
      source_type: vehicle.source_type,
      status: vehicle.status,
      photos: (vehicle.vehicle_photos ?? []).map((photo) => ({
        id: photo.id,
        vehicle_id: vehicle.id,
        storage_path: "",
        sort_order: 0,
        is_cover: photo.is_cover,
        alt_text: null,
        created_at: "",
      })),
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
  },
) {
  const provider = input.provider ?? "all";
  const status = input.status ?? "all";
  return rows.filter((row) => {
    if (provider !== "all" && row.provider !== provider) return false;
    if (status !== "all" && row.status !== status) return false;
    return opportunityMatchesQuery(row, input.query ?? "");
  });
}

export type OpportunityOverflowActionId =
  | "view"
  | "source"
  | "prepare"
  | "linked"
  | "archive";

export function opportunityOverflowActions(row: Pick<AuctionOpportunityRow, "id" | "source_url" | "linked_vehicle_id" | "status">) {
  const actions: { id: OpportunityOverflowActionId; label: string; href?: string; target?: string; danger?: boolean }[] = [
    { id: "view", label: "Ver oportunidad", href: `/admin/subastas/${row.id}` },
  ];
  if (row.source_url && isSafeHttpUrl(row.source_url)) {
    actions.push({ id: "source", label: "Abrir lote original", href: row.source_url, target: "_blank" });
  }
  if (row.linked_vehicle_id) {
    actions.push({
      id: "linked",
      label: "Ver vehículo vinculado",
      href: `/admin/inventario/${row.linked_vehicle_id}`,
    });
  } else {
    actions.push({ id: "prepare", label: "Preparar para website" });
  }
  if (row.status !== "archived") {
    actions.push({ id: "archive", label: "Archivar", danger: true });
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
