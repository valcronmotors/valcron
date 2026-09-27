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

export function isEcoVehicle(vehicle: Pick<PublicVehicle, "marca" | "modelo" | "trim" | "make" | "model">) {
  return ECO_PATTERN.test(`${vehicle.make || vehicle.marca} ${vehicle.model || vehicle.modelo} ${vehicle.trim ?? ""}`);
}

export function catalogMake(vehicle: PublicVehicle) {
  return (vehicle.make || vehicle.marca || "").trim();
}

export function catalogModel(vehicle: PublicVehicle) {
  return (vehicle.model || vehicle.modelo || "").trim();
}

export function catalogYear(vehicle: PublicVehicle) {
  return Number(vehicle.year || vehicle.ano || 0);
}

export function catalogUsdPrice(vehicle: PublicVehicle) {
  if (!vehicle.pricing?.priceVisible || vehicle.pricing.publicPriceMode === "contact") {
    return 0;
  }
  return Number(vehicle.pricing?.usdPrice ?? vehicle.precioVentaUsd ?? 0);
}

export function uniqueMarcas(vehicles: PublicVehicle[]) {
  return [...new Set(vehicles.map(catalogMake).filter(Boolean))].sort();
}

export function uniqueModelos(vehicles: PublicVehicle[], marca?: string) {
  return [
    ...new Set(
      vehicles
        .filter((vehicle) => !marca || catalogMake(vehicle) === marca)
        .map(catalogModel)
        .filter(Boolean),
    ),
  ].sort();
}

export function uniqueAnos(vehicles: PublicVehicle[]) {
  return [...new Set(vehicles.map(catalogYear).filter((year) => year > 0))].sort((a, b) => b - a);
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
  modelo?: string;
  ano?: string;
  listing?: string;
  price?: string;
}) {
  const params = new URLSearchParams();
  if (filters.marca) {
    params.set("marca", filters.marca);
  }
  if (filters.modelo) {
    params.set("modelo", filters.modelo);
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
  if (annualRate === 0) {
    return principal / months;
  }
  const monthlyRate = annualRate / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export type CatalogFilterState = {
  listing: string;
  marca: string;
  modelo: string;
  ano: string;
  precioMin: string;
  precioMax: string;
  search: string;
};

export function catalogQueryString(filters: CatalogFilterState) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.listing) params.set("listing", filters.listing);
  if (filters.marca) params.set("marca", filters.marca);
  if (filters.modelo) params.set("modelo", filters.modelo);
  if (filters.ano) params.set("ano", filters.ano);
  if (filters.precioMin) params.set("precioMin", filters.precioMin);
  if (filters.precioMax) params.set("precioMax", filters.precioMax);
  return params.toString();
}

export function filterCatalogVehicles(
  vehicles: PublicVehicle[],
  filters: CatalogFilterState,
  sort = "recent",
) {
  const needle = filters.search.trim().toLowerCase();
  const minUsd = Number(filters.precioMin);
  const maxUsd = Number(filters.precioMax);

  const rows = vehicles.filter((vehicle) => {
    if (filters.listing === "dealer" && vehicle.listingKind !== "dealer") return false;
    if (filters.listing === "auction" && vehicle.listingKind !== "auction") return false;
    if (filters.marca && catalogMake(vehicle) !== filters.marca) return false;
    if (filters.modelo && catalogModel(vehicle) !== filters.modelo) return false;
    if (filters.ano && String(catalogYear(vehicle)) !== filters.ano) return false;
    const usdPrice = catalogUsdPrice(vehicle);
    if (Number.isFinite(minUsd) && minUsd > 0 && usdPrice < minUsd) return false;
    if (Number.isFinite(maxUsd) && maxUsd > 0 && usdPrice > maxUsd) return false;
    if (!needle) return true;
    return [catalogMake(vehicle), catalogModel(vehicle), vehicle.trim ?? "", vehicle.vin ?? "", String(catalogYear(vehicle))]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return [...rows].sort((a, b) => {
    if (sort === "price-asc") return catalogUsdPrice(a) - catalogUsdPrice(b);
    if (sort === "price-desc") return catalogUsdPrice(b) - catalogUsdPrice(a);
    if (sort === "year") return catalogYear(b) - catalogYear(a);
    return 0;
  });
}
