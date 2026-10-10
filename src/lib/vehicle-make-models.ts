/**
 * Representative make/model catalog for Valcron Admin selectors (DR market).
 * Not an exhaustive manufacturer list — custom values are always allowed.
 */

export const OTHER_MAKE_VALUE = "__other_make__";
export const OTHER_MODEL_VALUE = "__other_model__";

export const VEHICLE_MAKE_OPTIONS = [
  "Toyota",
  "Honda",
  "Hyundai",
  "Kia",
  "Nissan",
  "Chevrolet",
  "Ford",
  "Mazda",
  "Mitsubishi",
  "Suzuki",
  "Jeep",
  "BMW",
  "Mercedes-Benz",
  "Lexus",
  "Acura",
  "Volkswagen",
  "Subaru",
  "Dodge",
  "RAM",
  "GMC",
  "Infiniti",
  "Audi",
  "Volvo",
  "Isuzu",
  "Changan",
  "Chery",
  "BYD",
] as const;

export type KnownVehicleMake = (typeof VEHICLE_MAKE_OPTIONS)[number];

/** Representative models per make. Extend freely; unknown models stay custom. */
export const VEHICLE_MODELS_BY_MAKE: Record<string, readonly string[]> = {
  Toyota: [
    "Corolla",
    "Camry",
    "RAV4",
    "Highlander",
    "Grand Highlander",
    "4Runner",
    "Tacoma",
    "Tundra",
    "Prius",
    "Sienna",
    "Land Cruiser",
    "Yaris",
    "Sequoia",
    "Hilux",
  ],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Passport", "Odyssey", "Ridgeline", "Fit"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade", "Venue", "Santa Cruz", "Ioniq 5"],
  Kia: [
    "Sportage",
    "Sorento",
    "Seltos",
    "K5",
    "Forte",
    "Rio",
    "Soul",
    "Telluride",
    "Carnival",
    "Niro",
    "Stinger",
  ],
  Nissan: ["Sentra", "Altima", "Versa", "Rogue", "Kicks", "Pathfinder", "Murano", "Frontier", "Armada", "Maxima"],
  Chevrolet: ["Equinox", "Trax", "Traverse", "Tahoe", "Suburban", "Silverado", "Malibu", "Blazer", "Colorado", "Spark"],
  Ford: ["Escape", "Explorer", "Edge", "Bronco", "Bronco Sport", "F-150", "Ranger", "Mustang", "Expedition", "Maverick"],
  Mazda: ["Mazda3", "Mazda6", "CX-30", "CX-5", "CX-50", "CX-90", "MX-5"],
  Mitsubishi: ["Outlander", "Eclipse Cross", "ASX", "Mirage", "L200", "Montero Sport"],
  Suzuki: ["Swift", "Vitara", "Jimny", "S-Cross", "XL7", "Baleno"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
  BMW: ["Serie 3", "Serie 5", "X1", "X3", "X5", "X7", "Serie 1"],
  "Mercedes-Benz": ["Clase C", "Clase E", "GLA", "GLC", "GLE", "GLS", "Clase A"],
  Lexus: ["RX", "NX", "ES", "GX", "LX", "UX", "IS"],
  Acura: ["MDX", "RDX", "TLX", "Integra", "ADX"],
  Volkswagen: ["Jetta", "Golf", "Tiguan", "Atlas", "Passat", "Taos", "ID.4"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Ascent", "Impreza", "Legacy"],
  Dodge: ["Charger", "Challenger", "Durango", "Hornet"],
  RAM: ["1500", "2500", "3500", "ProMaster"],
  GMC: ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon"],
  Infiniti: ["QX60", "QX50", "QX80", "Q50"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8"],
  Volvo: ["XC40", "XC60", "XC90", "S60", "S90"],
  Isuzu: ["D-Max", "mu-X", "NPR"],
  Changan: ["CS35 Plus", "CS55 Plus", "UNI-T", "Hunter", "Alsvin"],
  Chery: ["Tiggo 2", "Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo 5"],
  BYD: ["Song Plus", "Yuan Plus", "Seal", "Dolphin", "Tang", "Han"],
};

export const OTHER_MAKE_LABEL = "Otra marca";
export const OTHER_MODEL_LABEL = "Otro modelo";

export function normalizeCatalogKey(value: string) {
  return value.trim().toLowerCase();
}

export function findKnownMake(make: string): string | null {
  const key = normalizeCatalogKey(make);
  if (!key) return null;
  return VEHICLE_MAKE_OPTIONS.find((option) => normalizeCatalogKey(option) === key) ?? null;
}

export function modelsForMake(make: string): readonly string[] {
  const known = findKnownMake(make);
  if (!known) return [];
  return VEHICLE_MODELS_BY_MAKE[known] ?? [];
}

export function isKnownModelForMake(make: string, model: string) {
  const key = normalizeCatalogKey(model);
  if (!key) return false;
  return modelsForMake(make).some((option) => normalizeCatalogKey(option) === key);
}

export function makeRequiresCustomInput(make: string) {
  const trimmed = make.trim();
  if (!trimmed) return false;
  return !findKnownMake(trimmed);
}

export function modelRequiresCustomInput(make: string, model: string) {
  const trimmed = model.trim();
  if (!trimmed) return false;
  if (!findKnownMake(make)) return true;
  return !isKnownModelForMake(make, trimmed);
}

export function yearOptions(now = new Date()) {
  const current = now.getFullYear() + 1;
  const years: number[] = [];
  for (let year = current; year >= 1980; year -= 1) {
    years.push(year);
  }
  return years;
}

/** True when switching make would leave a saved model outside the new make's list. */
export function makeChangeConflictsWithModel(previousMake: string, nextMake: string, model: string) {
  const trimmedModel = model.trim();
  if (!trimmedModel) return false;
  if (normalizeCatalogKey(previousMake) === normalizeCatalogKey(nextMake)) return false;
  if (!findKnownMake(nextMake)) return false;
  return !isKnownModelForMake(nextMake, trimmedModel);
}
