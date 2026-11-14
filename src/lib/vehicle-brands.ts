/**
 * Mainstream makes customers may browse/filter.
 * Logo paths are local manufacturer-sourced assets — see docs/brand-assets.md.
 * Not partnerships, franchises, or authorized-dealer claims.
 */
export const VEHICLE_BRANDS = [
  { name: "Toyota", slug: "toyota", logoSrc: "/brands/toyota.svg" },
  { name: "Honda", slug: "honda", logoSrc: "/brands/honda.svg" },
  { name: "Hyundai", slug: "hyundai", logoSrc: "/brands/hyundai.svg" },
  { name: "Kia", slug: "kia", logoSrc: "/brands/kia.svg" },
  { name: "Nissan", slug: "nissan", logoSrc: "/brands/nissan.svg" },
  { name: "Chevrolet", slug: "chevrolet", logoSrc: "/brands/chevrolet.png" },
  { name: "Ford", slug: "ford", logoSrc: "/brands/ford.svg" },
  { name: "Mazda", slug: "mazda", logoSrc: "/brands/mazda.svg" },
  { name: "Mitsubishi", slug: "mitsubishi", logoSrc: "/brands/mitsubishi.svg" },
  { name: "Mercedes-Benz", slug: "mercedes-benz", logoSrc: "/brands/mercedes-benz.svg" },
  { name: "BMW", slug: "bmw", logoSrc: "/brands/bmw.svg" },
  { name: "GMC", slug: "gmc", logoSrc: "/brands/gmc.svg" },
  { name: "Lexus", slug: "lexus", logoSrc: "/brands/lexus.svg" },
] as const;

export type VehicleBrandName = (typeof VEHICLE_BRANDS)[number]["name"];
