import type { PublicVehicle } from "@/lib/public-catalog";

export const PRICE_RANGES = [
  { value: "", label: "Cualquier precio", min: 0, max: 0 },
  { value: "0-15000", label: "Hasta $15,000", min: 0, max: 15000 },
  { value: "15000-25000", label: "$15,000 – $25,000", min: 15000, max: 25000 },
  { value: "25000-40000", label: "$25,000 – $40,000", min: 25000, max: 40000 },
  { value: "40000", label: "$40,000 o más", min: 40000, max: 0 },
] as const;

const ECO_PATTERN =
  /\b(hybrid|h[ií]brido|phev|plug-?in|el[eé]ctric[oa]|ev\b|prius|ioniq|bolt|leaf|model [3syx]|id\.?\s?4|mach-?e)\b/i;

export function isEcoVehicle(vehicle: Pick<PublicVehicle, "marca" | "modelo" | "trim">) {
  return ECO_PATTERN.test(`${vehicle.marca} ${vehicle.modelo} ${vehicle.trim ?? ""}`);
}

export function uniqueMarcas(vehicles: PublicVehicle[]) {
  return [...new Set(vehicles.map((vehicle) => vehicle.marca).filter(Boolean))].sort();
}

export function uniqueAnos(vehicles: PublicVehicle[]) {
  return [...new Set(vehicles.map((vehicle) => vehicle.ano))].sort((a, b) => b - a);
}

export function parsePriceRange(value: string | null | undefined) {
  const range = PRICE_RANGES.find((item) => item.value === (value ?? ""));
  return {
    precioMin: range && range.min > 0 ? String(range.min) : value === "0-15000" ? "0" : "",
    precioMax: range && range.max > 0 ? String(range.max) : "",
  };
}

export function inventorySearchHref(filters: {
  marca?: string;
  ano?: string;
  listing?: string;
  price?: string;
}) {
  const params = new URLSearchParams();
  if (filters.marca) {
    params.set("marca", filters.marca);
  }
  if (filters.ano) {
    params.set("ano", filters.ano);
  }
  if (filters.listing) {
    params.set("listing", filters.listing);
  }
  const range = parsePriceRange(filters.price);
  if (filters.price === "0-15000") {
    params.set("precioMax", "15000");
  } else {
    if (range.precioMin) {
      params.set("precioMin", range.precioMin);
    }
    if (range.precioMax) {
      params.set("precioMax", range.precioMax);
    }
  }
  const query = params.toString();
  return query ? `/inventario?${query}` : "/inventario";
}

export function monthlyPayment(principal: number, months: number, annualRate = 0.16) {
  if (principal <= 0 || months <= 0) {
    return 0;
  }
  const monthlyRate = annualRate / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
