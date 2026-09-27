export type AdminSelectOption = { value: string; label: string };

export const ADMIN_TRANSMISSION_OPTIONS: AdminSelectOption[] = [
  { value: "Automática", label: "Automática" },
  { value: "Manual", label: "Manual" },
  { value: "CVT", label: "CVT" },
  { value: "Dual clutch", label: "Doble embrague" },
];

export const ADMIN_DRIVETRAIN_OPTIONS: AdminSelectOption[] = [
  { value: "Delantera", label: "Delantera" },
  { value: "Trasera", label: "Trasera" },
  { value: "4x4", label: "4x4" },
  { value: "AWD", label: "AWD" },
];

export const ADMIN_FUEL_OPTIONS: AdminSelectOption[] = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diésel", label: "Diésel" },
  { value: "Híbrido", label: "Híbrido" },
  { value: "Eléctrico", label: "Eléctrico" },
  { value: "Gas", label: "Gas" },
];

export const ADMIN_CONDITION_OPTIONS: AdminSelectOption[] = [
  { value: "Excelente", label: "Excelente" },
  { value: "Muy bueno", label: "Muy bueno" },
  { value: "Bueno", label: "Bueno" },
  { value: "Regular", label: "Regular" },
];

export const ADMIN_TITLE_STATUS_OPTIONS: AdminSelectOption[] = [
  { value: "Limpio", label: "Limpio" },
  { value: "Salvage", label: "Salvage" },
  { value: "Reconstruido", label: "Reconstruido" },
  { value: "Solo piezas", label: "Solo piezas" },
];

export function withCurrentOption(
  options: AdminSelectOption[],
  current: string | null | undefined,
): AdminSelectOption[] {
  const value = (current ?? "").trim();
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  return [{ value, label: value }, ...options];
}
