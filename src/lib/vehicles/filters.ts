import type { PublicVehicle, VehicleAvailability, VehicleQuery, VehicleSort } from "@/types/vehicle";

export const DEFAULT_PAGE_SIZE = 12;

export function matchesVehicleQuery(vehicle: PublicVehicle, query: VehicleQuery) {
  if (query.availability && query.availability !== "all" && vehicle.availability !== query.availability) {
    return false;
  }
  if (query.source && vehicle.source !== query.source) {
    return false;
  }
  if (query.make && vehicle.make !== query.make) {
    return false;
  }
  if (query.model && vehicle.model !== query.model) {
    return false;
  }
  if (query.year && vehicle.year !== query.year) {
    return false;
  }
  if (query.yearMin && vehicle.year < query.yearMin) {
    return false;
  }
  if (query.yearMax && vehicle.year > query.yearMax) {
    return false;
  }
  const usd = vehicle.pricing.usdPrice ?? 0;
  if (query.priceMinUsd && query.priceMinUsd > 0 && (usd <= 0 || usd < query.priceMinUsd)) {
    return false;
  }
  if (query.priceMaxUsd && query.priceMaxUsd > 0 && (usd <= 0 || usd > query.priceMaxUsd)) {
    return false;
  }
  const needle = query.q?.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return [
    vehicle.make,
    vehicle.model,
    vehicle.trim ?? "",
    String(vehicle.year),
    vehicle.vin ?? "",
    vehicle.auction?.lotNumber ?? "",
    vehicle.stockNumber ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function sortVehicles(vehicles: PublicVehicle[], sort: VehicleSort = "recent") {
  const copy = [...vehicles];
  copy.sort((a, b) => {
    if (sort === "price_asc" || sort === "price_desc") {
      const aPrice = a.pricing.priceVisible ? (a.pricing.usdPrice ?? 0) : Number.POSITIVE_INFINITY;
      const bPrice = b.pricing.priceVisible ? (b.pricing.usdPrice ?? 0) : Number.POSITIVE_INFINITY;
      if (aPrice === bPrice) {
        return b.year - a.year;
      }
      return sort === "price_asc" ? aPrice - bPrice : bPrice - aPrice;
    }
    if (sort === "year_asc") {
      return a.year - b.year;
    }
    if (sort === "year_desc") {
      return b.year - a.year;
    }
    const aTime = Date.parse(a.updatedAt ?? a.createdAt ?? "") || a.year;
    const bTime = Date.parse(b.updatedAt ?? b.createdAt ?? "") || b.year;
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    return b.year - a.year;
  });
  return copy;
}

export function paginateVehicles(vehicles: PublicVehicle[], page = 1, limit = DEFAULT_PAGE_SIZE) {
  const safeLimit = Math.min(Math.max(limit, 1), 48);
  const total = vehicles.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * safeLimit;
  return {
    data: vehicles.slice(start, start + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
}

export function availabilityCounts(vehicles: PublicVehicle[]) {
  return vehicles.reduce<Partial<Record<VehicleAvailability, number>>>((counts, vehicle) => {
    counts[vehicle.availability] = (counts[vehicle.availability] ?? 0) + 1;
    return counts;
  }, {});
}

export function selectFeaturedVehicles(vehicles: PublicVehicle[], limit = 4) {
  const flagged = vehicles.filter((vehicle) => vehicle.featured && vehicle.availability !== "sold");
  if (flagged.length >= limit) {
    return flagged.slice(0, limit);
  }
  const available = vehicles.filter((vehicle) => vehicle.availability === "available_rd");
  const rest = vehicles.filter((vehicle) => vehicle.availability !== "available_rd" && vehicle.availability !== "sold");
  return [...flagged, ...available.filter((vehicle) => !flagged.includes(vehicle)), ...rest].slice(0, limit);
}

export function similarVehicles(vehicle: PublicVehicle, pool: PublicVehicle[], limit = 4) {
  const scored = pool
    .filter((item) => item.id !== vehicle.id && item.availability !== "sold")
    .map((item) => {
      let score = 0;
      if (item.make === vehicle.make) score += 4;
      if (item.model === vehicle.model) score += 3;
      if (Math.abs(item.year - vehicle.year) <= 2) score += 2;
      if (item.availability === vehicle.availability) score += 1;
      const a = item.pricing.usdPrice ?? 0;
      const b = vehicle.pricing.usdPrice ?? 0;
      if (a > 0 && b > 0 && Math.abs(a - b) / b <= 0.35) score += 2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const picked = scored.filter((entry) => entry.score > 0).slice(0, limit).map((entry) => entry.item);
  if (picked.length >= limit) {
    return picked;
  }
  const fallback = pool.filter((item) => item.id !== vehicle.id && item.availability !== "sold" && !picked.includes(item));
  return [...picked, ...fallback].slice(0, limit);
}
