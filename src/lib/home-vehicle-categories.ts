export type HomeVehicleCategory = "suv" | "sedan" | "truck" | "hybrid" | "electric";

export const HOME_VEHICLE_TABS = [
  { id: "all", label: "Todos" },
  { id: "suv", label: "SUV y Crossovers" },
  { id: "sedan", label: "Sedanes" },
  { id: "truck", label: "Camionetas" },
  { id: "hybrid", label: "Híbridos" },
  { id: "electric", label: "Eléctricos" },
] as const;

export type HomeVehicleTab = (typeof HOME_VEHICLE_TABS)[number]["id"];

const SUV = /\b(suv|crossover|cuv|sport utility|utilitario)\b/i;
const SEDAN = /\b(sed[aá]n|saloon)\b/i;
const TRUCK = /\b(pickup|pick-up|truck|camioneta)\b/i;
const HYBRID = /\b(h[ií]brido|hybrid|hev|phev|plug-?in)\b/i;
const ELECTRIC = /\b(el[eé]ctrico|electric|bev)\b/i;

type ClassifiableVehicle = {
  bodyType?: string | null;
  fuelType?: string | null;
  model?: string | null;
  modelo?: string | null;
  trim?: string | null;
  description?: string | null;
};

/** Categories implied by published fields. Unrecognized vehicles stay in Todos only. */
export function homeVehicleCategories(vehicle: ClassifiableVehicle): HomeVehicleCategory[] {
  const body = [vehicle.bodyType, vehicle.model, vehicle.modelo, vehicle.trim, vehicle.description]
    .filter(Boolean)
    .join(" ");
  const fuel = vehicle.fuelType ?? "";
  const categories: HomeVehicleCategory[] = [];

  if (SUV.test(body)) categories.push("suv");
  if (SEDAN.test(body)) categories.push("sedan");
  if (TRUCK.test(body) && !SUV.test(body)) categories.push("truck");
  if (HYBRID.test(fuel) || HYBRID.test(body)) categories.push("hybrid");
  if (ELECTRIC.test(fuel) && !HYBRID.test(fuel)) categories.push("electric");

  return categories;
}

export function vehicleMatchesHomeTab(vehicle: ClassifiableVehicle, tab: HomeVehicleTab) {
  if (tab === "all") return true;
  return homeVehicleCategories(vehicle).includes(tab);
}
