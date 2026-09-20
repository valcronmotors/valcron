const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isVehicleUuid(value: string) {
  return UUID_PATTERN.test(value.trim());
}

export function slugifyVehiclePart(value: string | number | null | undefined) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function vehicleIdToken(id: string) {
  return id.replace(/-/g, "").slice(0, 8);
}

export function buildVehicleSlug(input: {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
}) {
  const parts = [input.year, input.make, input.model, input.trim]
    .map((part) => slugifyVehiclePart(part))
    .filter(Boolean);
  return `${parts.join("-")}-${vehicleIdToken(input.id)}`;
}

export function vehiclePath(slug: string) {
  return `/inventario/${slug}`;
}

export function matchesVehicleSlug(slug: string, id: string) {
  const token = slug.trim().split("-").pop()?.toLowerCase() ?? "";
  return token === vehicleIdToken(id) || slug.trim() === id;
}
