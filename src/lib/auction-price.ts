import { auctionFeesForPrice } from "@/lib/import-estimate";
import { formatDecimal } from "@/lib/money";

/**
 * Precio público de subasta (orden de Gabriel, 2026-11-27):
 * compra estimada + fees de subasta + US$1,500 de ganancia.
 * Ya no se publica el total «puesto en RD»: el flete, los impuestos, la primera
 * placa y la gestión de importación se cotizan aparte.
 */
export const AUCTION_PROFIT_USD = 1500;

export const AUCTION_PRICE_NOTE =
  "Flete, impuestos, primera placa y gestión de importación. Se cotizan por WhatsApp.";

export type AuctionFeeProvider = "copart" | "iaai";

export function auctionProviderFromPlatform(platform: string | null | undefined): AuctionFeeProvider {
  return platform === "iaai" ? "iaai" : "copart";
}

/** Total de fees de subasta según la misma tabla de la calculadora de importación. */
export function auctionFeesTotalUsd(purchaseUsd: number, provider: AuctionFeeProvider) {
  const fees = auctionFeesForPrice(purchaseUsd, provider);
  return fees.buyer + fees.internet + fees.fixed;
}

/** Precio público según la fórmula vigente; null si la compra estimada no es válida. */
export function auctionPublicPriceUsd(
  purchaseUsd: number | null | undefined,
  provider: AuctionFeeProvider,
): number | null {
  const purchase = Number(purchaseUsd);
  if (!Number.isFinite(purchase) || purchase <= 0) return null;
  return Math.round(purchase + auctionFeesTotalUsd(purchase, provider) + AUCTION_PROFIT_USD);
}

/** Precio público formateado, sin etiqueta (orden de Gabriel, 2026-11-27: el precio sale solo). */
export function auctionPriceLabel(amount: number) {
  return `US$${formatDecimal(amount, amount % 1 ? 2 : 0)}`;
}

export function parseAuctionPurchaseEstimate(raw: string) {
  const trimmed = raw.trim();
  if (trimmed === "") return { data: { auction_purchase_estimate_usd: null } } as const;
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0 || amount >= 1e12) {
    return { error: "Ingresa una compra estimada válida en US$." } as const;
  }
  return { data: { auction_purchase_estimate_usd: amount } } as const;
}

export function isMissingAuctionPurchaseColumn(
  error: { message?: string | null } | null | undefined,
) {
  const message = (error?.message ?? "").toLowerCase();
  return (
    message.includes("auction_purchase_estimate_usd") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  );
}

export function vehicleSelectWithoutAuctionPurchase(select: string) {
  return select
    .replace(/,?\s*auction_purchase_estimate_usd\s*,?/gi, ",")
    .replace(/,\s*,/g, ",")
    .replace(/^\s*,\s*|\s*,\s*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/,\s*/g, ", ")
    .trim();
}
