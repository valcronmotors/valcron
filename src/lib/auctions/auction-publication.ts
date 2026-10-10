import type { AuctionAdminPriceMode } from "@/lib/auction-admin-fields";
import type { PublicationCheck } from "@/lib/publication-readiness";
import type { AuctionProvider } from "@/lib/website-schema";

export type AuctionPublicationInput = {
  provider?: AuctionProvider | string | null;
  provider_lot_id?: string | null;
  year?: number | string | null;
  make?: string | null;
  model?: string | null;
  location?: string | null;
  price_mode?: AuctionAdminPriceMode | string | null;
  buy_now_usd?: number | null;
  hasCoverPhoto?: boolean;
  photoCount?: number;
};

/** Auction-only publication rules — never require local inventory availability. */
export function auctionPublicationChecks(input: AuctionPublicationInput): PublicationCheck[] {
  const provider = String(input.provider ?? "").trim().toLowerCase();
  const lot = String(input.provider_lot_id ?? "").trim();
  const year = Number(input.year);
  const make = String(input.make ?? "").trim();
  const model = String(input.model ?? "").trim();
  const location = String(input.location ?? "").trim();
  const priceMode = input.price_mode === "buy_now" ? "buy_now" : "contact";
  const buyNowOk =
    priceMode === "contact" || (typeof input.buy_now_usd === "number" && input.buy_now_usd > 0);
  const providerOk = provider === "copart" || provider === "iaa" || provider === "manheim" || provider === "other";

  return [
    {
      id: "provider",
      label: "Casa de subasta",
      ok: providerOk,
      required: true,
    },
    {
      id: "lot",
      label: "Número de lote",
      ok: Boolean(lot),
      required: true,
    },
    {
      id: "identity",
      label: "Año, marca y modelo",
      ok: Number.isFinite(year) && year >= 1980 && Boolean(make && model),
      required: true,
    },
    {
      id: "location",
      label: "Ubicación de subasta",
      ok: Boolean(location),
      required: false,
    },
    {
      id: "cover",
      label: "Foto de portada",
      ok: Boolean(input.hasCoverPhoto || (input.photoCount ?? 0) > 0),
      required: true,
    },
    {
      id: "price_mode",
      label: priceMode === "buy_now" ? "Buy Now verificado" : "Modo de precio público",
      ok: buyNowOk,
      required: true,
    },
  ];
}

export function canPublishAuctionOpportunity(checks: PublicationCheck[]) {
  return checks.filter((check) => check.required).every((check) => check.ok);
}

export function auctionPublicationBlockers(checks: PublicationCheck[]) {
  return checks.filter((check) => check.required && !check.ok).map((check) => check.label);
}

export function auctionPublicationBlockMessage(input: AuctionPublicationInput) {
  const checks = auctionPublicationChecks(input);
  if (canPublishAuctionOpportunity(checks)) return null;
  return `Completa lo obligatorio antes de publicar: ${auctionPublicationBlockers(checks).join(", ")}.`;
}
