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

  const usd = formatVehiclePrice(pricing.usdPrice, "USD");
  const dop = formatVehiclePrice(pricing.rdPrice, "DOP");
  const primary = currency === "DOP" ? dop ?? usd : usd ?? dop;
  const secondary = currency === "DOP" ? (dop && usd ? usd : undefined) : usd && dop ? dop : undefined;
  const auctionListing = vehicle.availability === "auction" || vehicle.listingKind === "auction";
  return {
    label: auctionListing && pricing.kind === "sale" ? "Precio publicado" : priceKindLabel(pricing.kind),
    primary: primary ?? "Consultar precio",
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

function yesNo(value: boolean | null | undefined) {
  if (value == null) return null;
  return value ? "Sí" : "No";
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

function formatPublicDate(value: string | null | undefined) {
  if (!value) return null;
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = Number(isoDate[2]);
    const day = Number(isoDate[3]);
    const label = MONTHS_ES[month - 1];
    if (!label || day < 1 || day > 31) return null;
    return `${day} de ${label} de ${year}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getUTCDate()} de ${MONTHS_ES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}

export function vehiclePublicPriceBlocks(vehicle: PublicVehicle) {
  const pricing = vehicle.pricing;
  const bid = pricing.currentBid ?? vehicle.auction?.currentBid;
  const buyNow = pricing.buyNowPrice ?? vehicle.auction?.buyNowPrice;
  const estimated = pricing.estimatedPrice;
  const saleUsd = pricing.usdPrice;
  const saleDop = pricing.rdPrice;
  const blocks: { kind: VehiclePriceKind; label: string; primary: string; secondary?: string; note?: string }[] = [];

  if (bid) {
    const amount = formatVehiclePrice(bid, "USD");
    if (amount) {
      blocks.push({
        kind: "current_bid",
        label: "Oferta actual",
        primary: amount,
        note: "Es una puja o referencia de subasta, no el costo final de entrega en República Dominicana.",
      });
    }
  }
  if (buyNow) {
    const amount = formatVehiclePrice(buyNow, "USD");
    if (amount) {
      blocks.push({
        kind: "buy_now",
        label: "Compra ahora",
        primary: amount,
        note: "Precio de compra inmediata en la plataforma, cuando está publicado. No incluye importación ni entrega en RD.",
      });
    }
  }
  if (estimated) {
    const amount = formatVehiclePrice(estimated, "USD");
    if (amount) {
      blocks.push({
        kind: "estimated",
        label: "Estimado",
        primary: amount,
      });
    }
  }

  const usd = formatVehiclePrice(saleUsd, "USD");
  const dop = formatVehiclePrice(saleDop, "DOP");
  if ((usd || dop) && pricing.priceVisible) {
    const isAuction = vehicle.availability === "auction" || vehicle.listingKind === "auction";
    blocks.push({
      kind: isAuction ? "estimated" : "sale",
      label: isAuction ? "Precio publicado" : "Precio de venta",
      primary: (usd ?? dop) as string,
      secondary: usd && dop ? dop : undefined,
      note: isAuction
        ? "No representa el costo final de importación, impuestos ni entrega en República Dominicana."
        : undefined,
    });
  }

  if (!blocks.length) {
    blocks.push({ kind: "consult", label: "Consultar precio", primary: "Consultar precio" });
  }

  return blocks;
}

export function visibleVehicleSpecs(vehicle: PublicVehicle) {
  const platform =
    vehicle.source === "copart" || vehicle.source === "iaai" || vehicle.source === "manheim"
      ? sourceLabel(vehicle.source)
      : vehicle.fuenteSubasta
        ? sourceLabel(vehicle.source)
        : null;

  const rows: { label: string; value: string | null }[] = [
    { label: "Año", value: vehicle.year || vehicle.ano ? String(vehicle.year || vehicle.ano) : null },
    { label: "Marca", value: presentText(vehicle.make || vehicle.marca) },
    { label: "Modelo", value: presentText(vehicle.model || vehicle.modelo) },
    { label: "Versión", value: presentText(vehicle.trim) },
    { label: "VIN", value: formatPublicVin(vehicle.vin) },
    { label: "Número de stock", value: presentText(vehicle.stockNumber) },
    { label: "Número de lote", value: presentText(vehicle.auction?.lotNumber) },
    { label: "Fuente / plataforma", value: platform },
    { label: "Estado", value: availabilityLabel(vehicle.availability) },
    { label: "Ubicación", value: presentText(vehicle.location ?? vehicle.ubicacion) },
    { label: "Kilometraje", value: formatMileage(vehicle.mileage, vehicle.mileageUnit) },
    { label: "Motor", value: presentText(vehicle.engine) },
    { label: "Cilindros", value: vehicle.cylinders ? String(vehicle.cylinders) : null },
    { label: "Combustible", value: presentText(vehicle.fuelType) },
    { label: "Transmisión", value: presentText(vehicle.transmission) },
    { label: "Tracción", value: presentText(vehicle.drivetrain) },
    { label: "Color exterior", value: presentText(vehicle.exteriorColor) },
    { label: "Color interior", value: presentText(vehicle.interiorColor) },
    { label: "Tipo de carrocería", value: presentText(vehicle.bodyType) },
    { label: "Tipo de título", value: presentText(vehicle.titleType) },
    { label: "Condición", value: presentText(vehicle.condition) },
    { label: "Daño primario", value: presentText(vehicle.primaryDamage) },
    { label: "Daño secundario", value: presentText(vehicle.secondaryDamage) },
    { label: "Llaves", value: yesNo(vehicle.keysAvailable) },
    { label: "Run and Drive", value: yesNo(vehicle.runAndDrive) },
    { label: "Estado de subasta", value: presentText(vehicle.auction?.saleStatus) },
    { label: "Fecha de subasta", value: formatPublicDate(vehicle.auction?.saleDate) },
  ];

  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value));
}

export function vehicleSeoDescription(vehicle: PublicVehicle) {
  const title = vehicleDisplayTitle(vehicle);
  const parts = [title, availabilityLabel(vehicle.availability)];
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  if (mileage) parts.push(mileage);
  if (vehicle.location) parts.push(vehicle.location);
  if (vehicle.source === "copart" || vehicle.source === "iaai" || vehicle.source === "manheim") {
    const platform = sourceLabel(vehicle.source);
    if (platform) parts.push(`Fuente: ${platform}`);
  }
  if (vehicle.availability === "sold") {
    return `${parts.join(". ")}. Consulta unidades similares en Valcron Motors, Santo Domingo Este.`;
  }
  return `${parts.join(". ")}. ${SITE.shortName}, dealer en Santo Domingo Este, República Dominicana.`;
}
