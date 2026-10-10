import {
  formatCustomerFacingPrice,
  resolvePublicPriceMode,
} from "@/lib/public-price-mode";
import { formatDecimal } from "@/lib/money";
import { SITE, whatsappHref } from "@/lib/site";
import { availabilityLabel, sourceLabel } from "@/lib/vehicles/vehicle-status";
import type { PublicVehicle, VehicleCurrency, VehiclePriceKind } from "@/types/vehicle";

export const VIN_PUBLIC_POLICY = {
  stock_rd: "full" as const,
  auction: "full" as const,
  default: "full" as const,
};

export function formatPublicVin(vin: string | null | undefined) {
  const value = (vin ?? "").trim().toUpperCase();
  if (!value) return null;
  if (VIN_PUBLIC_POLICY.default === "full") {
    return value;
  }
  return `***********${value.slice(-6)}`;
}

export function vehicleDisplayTitle(vehicle: Pick<PublicVehicle, "year" | "make" | "model" | "trim" | "ano" | "marca" | "modelo">) {
  const year = vehicle.year ?? vehicle.ano;
  const make = vehicle.make ?? vehicle.marca;
  const model = vehicle.model ?? vehicle.modelo;
  const trim = vehicle.trim ? ` ${vehicle.trim}` : "";
  return `${year} ${make} ${model}${trim}`.replace(/\s+/g, " ").trim();
}

export function formatVehiclePrice(amount: number | null | undefined, currency: VehicleCurrency = "USD") {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  const cents = Math.round(amount * 100);
  const fractionDigits: 0 | 2 = cents % 100 === 0 ? 0 : 2;
  const formatted = formatDecimal(amount, fractionDigits);
  return currency === "DOP" ? `RD$ ${formatted}` : `US$ ${formatted}`;
}

export function priceKindLabel(kind: VehiclePriceKind | null | undefined) {
  switch (kind) {
    case "current_bid":
      return "Oferta actual";
    case "buy_now":
      return "Comprar ahora";
    case "from":
      return "Desde";
    case "estimated":
      return "Precio estimado";
    case "consult":
      return "Consultar precio";
    default:
      return "Precio de venta";
  }
}

export function displayVehiclePrice(
  vehicle: PublicVehicle,
  currency: VehicleCurrency,
): { label: string; primary: string; secondary?: string } {
  const mode =
    vehicle.pricing.publicPriceMode ??
    resolvePublicPriceMode(
      vehicle.listingKind === "auction" ? "other" : "valcron_stock",
      vehicle.pricing.kind === "consult"
        ? "contact"
        : vehicle.pricing.kind === "from"
          ? "from"
          : vehicle.pricing.kind === "estimated"
            ? "estimated"
            : "fixed",
    );
  const preferredAmount =
    currency === "DOP"
      ? vehicle.pricing.rdPrice ?? vehicle.pricing.usdPrice
      : vehicle.pricing.usdPrice ?? vehicle.pricing.rdPrice;
  const preferredCurrency: VehicleCurrency =
    currency === "DOP" && vehicle.pricing.rdPrice
      ? "DOP"
      : vehicle.pricing.usdPrice
        ? "USD"
        : currency;
  const auctionListing = vehicle.listingKind === "auction" || vehicle.availability === "auction";
  const primary = formatCustomerFacingPrice(mode, preferredAmount, preferredCurrency, {
    auctionBuyNow: auctionListing && mode === "fixed",
  });
  const otherAmount = preferredCurrency === "USD" ? vehicle.pricing.rdPrice : vehicle.pricing.usdPrice;
  const otherCurrency: VehicleCurrency = preferredCurrency === "USD" ? "DOP" : "USD";
  const secondary =
    mode !== "contact" && vehicle.pricing.priceVisible
      ? formatVehiclePrice(otherAmount, otherCurrency) ?? undefined
      : undefined;

  return {
    label: auctionListing && mode === "fixed" ? "Buy Now" : mode === "fixed" ? "Precio de venta" : "Precio",
    primary,
    secondary,
  };
}

export function formatMileage(mileage: number | null | undefined, unit: "mi" | "km" = "km") {
  if (mileage == null || !Number.isFinite(mileage) || mileage < 0) {
    return null;
  }
  return `${formatDecimal(mileage, 0)} ${unit}`;
}

export function formatRelativeUpdate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} h`;
  }
  return new Intl.DateTimeFormat("es-DO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function buildVehicleWhatsAppMessage(vehicle: PublicVehicle) {
  const title = vehicleDisplayTitle(vehicle);
  const url = canonicalVehicleUrl(vehicle);
  if (vehicle.availability === "auction" || vehicle.listingKind === "auction") {
    const lot = vehicle.auction?.lotNumber?.trim();
    const provider = vehicle.fuenteSubasta?.trim();
    const lotPart = lot ? ` (lote ${lot}${provider ? ` · ${provider}` : ""})` : provider ? ` (${provider})` : "";
    return `Hola, me interesa recibir una cotización para esta oportunidad de subasta: ${title}${lotPart}. ${url}`;
  }
  if (vehicle.availability === "sold") {
    return `Hola, me interesa un vehículo similar a este: ${title}. ${url}`;
  }
  return `Hola, me interesa este vehículo disponible en Valcron: ${title}. ${url}`;
}

export function buildVehicleWhatsAppUrl(vehicle: PublicVehicle) {
  return whatsappHref(buildVehicleWhatsAppMessage(vehicle));
}

export function vehicleImageAlt(vehicle: PublicVehicle, index = 0) {
  const title = vehicleDisplayTitle(vehicle);
  const category = vehicle.images[index]?.category;
  if (category === "interior") return `${title} — interior`;
  if (category === "damage") return `${title} — daños reportados`;
  if (category === "engine") return `${title} — motor`;
  if (index === 0) {
    return vehicle.availability === "sold"
      ? `${title} en Valcron Motors`
      : `${title} disponible en Valcron Motors`;
  }
  return `${title} — imagen ${index + 1}`;
}

export function canonicalVehicleUrl(vehicle: PublicVehicle) {
  return `${SITE.url}/inventario/${vehicle.slug}`;
}

function presentText(value: string | number | null | undefined) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text || text === "null" || text === "undefined" || /^n\/?a$/i.test(text)) {
    return null;
  }
  return text;
}

export function vehiclePublicPriceBlocks(vehicle: PublicVehicle) {
  const displayed = displayVehiclePrice(vehicle, vehicle.pricing.currency ?? "USD");
  return [
    {
      kind: vehicle.pricing.kind ?? "sale",
      label: displayed.label,
      primary: displayed.primary,
      secondary: displayed.secondary,
    },
  ];
}

export function visibleVehicleSpecs(vehicle: PublicVehicle) {
  const platform = vehicle.source === "copart" || vehicle.source === "iaai" ? sourceLabel(vehicle.source) : null;

  const rows: { label: string; value: string | null }[] = [
    { label: "Año", value: vehicle.year || vehicle.ano ? String(vehicle.year || vehicle.ano) : null },
    { label: "Marca", value: presentText(vehicle.make || vehicle.marca) },
    { label: "Modelo", value: presentText(vehicle.model || vehicle.modelo) },
    { label: "Versión", value: presentText(vehicle.trim) },
    { label: "VIN", value: formatPublicVin(vehicle.vin) },
    { label: "Número de stock", value: presentText(vehicle.stockNumber) },
    { label: "Número de lote", value: presentText(vehicle.auction?.lotNumber) },
    { label: "Plataforma de origen", value: platform },
    { label: "Estado", value: availabilityLabel(vehicle.availability) },
    { label: "Kilometraje", value: formatMileage(vehicle.mileage, vehicle.mileageUnit) },
    { label: "Motor", value: presentText(vehicle.engine) },
    { label: "Cilindros", value: vehicle.cylinders ? String(vehicle.cylinders) : null },
    { label: "Combustible", value: presentText(vehicle.fuelType) },
    { label: "Transmisión", value: presentText(vehicle.transmission) },
    { label: "Tracción", value: presentText(vehicle.drivetrain) },
    { label: "Color exterior", value: presentText(vehicle.exteriorColor) },
    { label: "Color interior", value: presentText(vehicle.interiorColor) },
    { label: "Tipo de carrocería", value: presentText(vehicle.bodyType) },
    { label: "Condición", value: presentText(vehicle.condition) },
  ];

  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value));
}

export function vehicleSeoDescription(vehicle: PublicVehicle) {
  const title = vehicleDisplayTitle(vehicle);
  const parts = [title, availabilityLabel(vehicle.availability)];
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  if (mileage) parts.push(mileage);
  if (vehicle.source === "copart" || vehicle.source === "iaai" || vehicle.source === "manheim") {
    const platform = sourceLabel(vehicle.source);
    if (platform) parts.push(`Fuente: ${platform}`);
  }
  if (vehicle.availability === "sold") {
    return `${parts.join(". ")}. Consulta unidades similares en Valcron Motors, Santo Domingo Este.`;
  }
  return `${parts.join(". ")}. ${SITE.shortName}, dealer en Santo Domingo Este, República Dominicana.`;
}
