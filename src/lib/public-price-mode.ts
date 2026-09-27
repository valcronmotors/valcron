import { formatDecimal } from "@/lib/money";
import {
  PUBLIC_PRICE_MODES,
  type PublicPriceMode,
  type VehicleSourceType,
} from "@/lib/website-schema";
import type { VehiclePriceKind } from "@/types/vehicle";

export { PUBLIC_PRICE_MODES, type PublicPriceMode };

function formatAmount(amount: number | null | undefined, currency: "USD" | "DOP") {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  const cents = Math.round(amount * 100);
  const fractionDigits: 0 | 2 = cents % 100 === 0 ? 0 : 2;
  const formatted = formatDecimal(amount, fractionDigits);
  return currency === "DOP" ? `RD$ ${formatted}` : `US$ ${formatted}`;
}

export const PUBLIC_PRICE_MODE_LABELS: Record<PublicPriceMode, string> = {
  contact: "Consultar precio",
  from: "Desde",
  estimated: "Precio estimado",
  fixed: "Precio fijo",
};

export function isPublicPriceMode(value: unknown): value is PublicPriceMode {
  return PUBLIC_PRICE_MODES.includes(value as PublicPriceMode);
}

export function isAuctionOriginSource(sourceType: VehicleSourceType | null | undefined) {
  return sourceType === "other";
}

export function defaultPublicPriceMode(sourceType: VehicleSourceType | null | undefined): PublicPriceMode {
  return isAuctionOriginSource(sourceType) ? "contact" : "fixed";
}

export function resolvePublicPriceMode(
  sourceType: VehicleSourceType | null | undefined,
  stored: string | null | undefined,
): PublicPriceMode {
  if (!isAuctionOriginSource(sourceType)) {
    return "fixed";
  }
  return isPublicPriceMode(stored) ? stored : "contact";
}

export function publicPriceModeRequiresAmount(
  sourceType: VehicleSourceType | null | undefined,
  mode: PublicPriceMode,
) {
  if (!isAuctionOriginSource(sourceType)) {
    return true;
  }
  return mode !== "contact";
}

export function publicPriceAmountOk(
  sourceType: VehicleSourceType | null | undefined,
  mode: PublicPriceMode,
  price: number | null | undefined,
) {
  if (!publicPriceModeRequiresAmount(sourceType, mode)) {
    return true;
  }
  const amount = Number(price);
  return Number.isFinite(amount) && amount > 0;
}

export function publicPriceKind(mode: PublicPriceMode): VehiclePriceKind {
  if (mode === "contact") return "consult";
  if (mode === "from") return "from";
  if (mode === "estimated") return "estimated";
  return "sale";
}

export function formatCustomerFacingPrice(
  mode: PublicPriceMode,
  amount: number | null | undefined,
  currency: "USD" | "DOP" = "USD",
) {
  if (mode === "contact") {
    return "Consultar precio";
  }
  const formatted = formatAmount(amount, currency);
  if (!formatted) {
    return "Consultar precio";
  }
  if (mode === "from") return `Desde ${formatted}`;
  if (mode === "estimated") return `Precio estimado ${formatted}`;
  return formatted;
}

export function auctionPublicPriceDisclaimer(mode: PublicPriceMode) {
  switch (mode) {
    case "contact":
      return "El precio final depende del resultado de la subasta y de los servicios seleccionados.";
    case "from":
      return "Precio de referencia. El total puede variar según el resultado de la subasta, transporte y servicios seleccionados.";
    case "estimated":
      return "Estimación sujeta al resultado de la subasta y a los costos aplicables.";
    default:
      return null;
  }
}

export function shouldEmitStructuredOfferPrice(mode: PublicPriceMode) {
  return mode === "fixed";
}

export const AUCTION_QUOTE_PREFILL =
  "Me interesa recibir una cotización para este vehículo disponible mediante subasta.";

export const AUCTION_SERVICE_COPY =
  "Valcron Motors puede gestionar la compra, transporte e importación de esta unidad.";

export function isMissingPublicPriceModeColumn(error: { message?: string | null } | null | undefined) {
  const message = (error?.message ?? "").toLowerCase();
  return message.includes("public_price_mode") && (message.includes("does not exist") || message.includes("schema cache"));
}

export function vehicleSelectWithoutPublicPriceMode(select: string) {
  return select
    .replace(/,?\s*public_price_mode\s*,?/gi, ",")
    .replace(/,\s*,/g, ",")
    .replace(/^\s*,\s*|\s*,\s*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/,\s*/g, ", ")
    .trim();
}

export function omitPublicPriceModeColumn<T extends Record<string, unknown>>(data: T) {
  const next = { ...data };
  delete next.public_price_mode;
  return next;
}
