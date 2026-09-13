export const COMPANY_NAMES = {
  valcron: "Valcron Motors Group SRL",
  partsDirect: "108 Parts Direct LLC",
} as const;

export type CompanySlug = "valcron-motors-group-srl" | "108-parts-direct-llc";

export type Company = {
  slug: CompanySlug;
  nombre: string;
  rnc: string;
  legacyNames: string[];
  inventario: "vehiculos" | "repuestos";
  etiquetaInventario: string;
};

export const COMPANIES: Company[] = [
  {
    slug: "valcron-motors-group-srl",
    nombre: COMPANY_NAMES.valcron,
    rnc: "130000001",
    legacyNames: ["Valcron Motors Group", "Valcron Motors", "Valcron"],
    inventario: "vehiculos",
    etiquetaInventario: "Catálogo de vehículos",
  },
  {
    slug: "108-parts-direct-llc",
    nombre: COMPANY_NAMES.partsDirect,
    rnc: "130000002",
    legacyNames: ["108partsdirect", "108 Parts Direct", "108 Parts"],
    inventario: "repuestos",
    etiquetaInventario: "Catálogo de partes",
  },
];

export function companyBySlug(slug: CompanySlug | null | undefined) {
  return COMPANIES.find((company) => company.slug === slug) ?? null;
}

export function companyByNombre(nombre: string | null | undefined) {
  if (!nombre) {
    return null;
  }
  return COMPANIES.find((company) => matchesCompany(nombre, company)) ?? null;
}

export function normalizeCompanyName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function matchesCompany(value: string, company: Company) {
  const normalized = normalizeCompanyName(value);
  return [company.nombre, ...company.legacyNames].some(
    (candidate) => normalizeCompanyName(candidate) === normalized,
  );
}

export function isCompanySlug(value: string | undefined): value is CompanySlug {
  return COMPANIES.some((company) => company.slug === value);
}
