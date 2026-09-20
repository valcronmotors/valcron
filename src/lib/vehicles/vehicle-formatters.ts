import { SITE, whatsappHref } from "@/lib/site";
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
  const rounded = Number.isInteger(amount) ? 0 : 2;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: rounded,
    maximumFractionDigits: rounded,
  }).format(amount);
  return currency === "DOP" ? `RD$ ${formatted}` : `US$ ${formatted}`;
}

export function priceKindLabel(kind: VehiclePriceKind | null | undefined) {
  switch (kind) {
    case "current_bid":
      return "Oferta actual";
    case "buy_now":
      return "Comprar ahora";
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
  const pricing = vehicle.pricing;
  if (!pricing.priceVisible) {
    return { label: priceKindLabel("consult"), primary: "Consultar precio" };
  }

  if (pricing.kind === "current_bid" && pricing.currentBid) {
    return {
      label: priceKindLabel("current_bid"),
      primary: formatVehiclePrice(pricing.currentBid, "USD") ?? "Consultar precio",
    };
  }

  const usd = pricing.usdPrice ?? 0;
  const dop = pricing.rdPrice ?? 0;
  const primary = currency === "DOP" ? formatVehiclePrice(dop, "DOP") : formatVehiclePrice(usd, "USD");
  const secondary = currency === "DOP" ? formatVehiclePrice(usd, "USD") : formatVehiclePrice(dop, "DOP");
  return {
    label: priceKindLabel(pricing.kind),
    primary: primary ?? "Consultar precio",
    secondary: secondary ?? undefined,
  };
}

export function formatMileage(mileage: number | null | undefined, unit: "mi" | "km" = "km") {
  if (mileage == null || !Number.isFinite(mileage) || mileage < 0) {
    return null;
  }
  const formatted = new Intl.NumberFormat("en-US").format(mileage);
  return `${formatted} ${unit}`;
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
  const lot = vehicle.auction?.lotNumber;
  if (vehicle.availability === "auction" && lot) {
    return `Hola, estoy interesado en el ${title}, lote ${lot}, que vi en Valcron Motors.`;
  }
  if (vehicle.availability === "sold") {
    return `Hola, estoy interesado en encontrar un vehículo similar al ${title} que vi en Valcron Motors.`;
  }
  return `Hola, estoy interesado en el ${title} que vi en Valcron Motors.`;
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
  if (index === 0) return `${title} — vista principal`;
  return `${title} — imagen ${index + 1}`;
}

export function canonicalVehicleUrl(vehicle: PublicVehicle) {
  return `${SITE.url}/inventario/${vehicle.slug}`;
}
