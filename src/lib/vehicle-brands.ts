/** Mainstream brands customers may search — not partnerships. */
export const VEHICLE_BRANDS = [
  { name: "Toyota", mark: "T" },
  { name: "Honda", mark: "H" },
  { name: "Hyundai", mark: "Hy" },
  { name: "Kia", mark: "K" },
  { name: "Nissan", mark: "N" },
  { name: "Chevrolet", mark: "C" },
  { name: "Ford", mark: "F" },
  { name: "Mazda", mark: "M" },
  { name: "Mitsubishi", mark: "Mi" },
] as const;

export type VehicleBrandName = (typeof VEHICLE_BRANDS)[number]["name"];
