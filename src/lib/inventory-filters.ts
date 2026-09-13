import type { PartRow, VehicleRow } from "@/lib/inventory";
import type { VehicleState } from "@/lib/vehicle-costs";

export type VehicleStatusFilter = "todos" | VehicleState;

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function matchesVehicleSearch(row: VehicleRow, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) {
    return true;
  }

  return [row.vin, row.marca, row.modelo, row.trim, row.lote_numero]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

export function matchesPartSearch(row: PartRow, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) {
    return true;
  }

  return [row.codigo_pieza, row.nombre]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

export function filterVehicles(
  rows: VehicleRow[],
  query: string,
  estado: VehicleStatusFilter,
) {
  return rows.filter((row) => {
    const matchesStatus =
      estado === "todos" || row.estado === estado;
    return matchesStatus && matchesVehicleSearch(row, query);
  });
}

export function filterParts(rows: PartRow[], query: string) {
  return rows.filter((row) => matchesPartSearch(row, query));
}
