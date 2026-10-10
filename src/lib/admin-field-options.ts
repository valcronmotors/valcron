export type AdminSelectOption = { value: string; label: string };

export const ADMIN_TRANSMISSION_OPTIONS: AdminSelectOption[] = [
  { value: "Automática", label: "Automática" },
  { value: "Manual", label: "Manual" },
  { value: "CVT", label: "CVT" },
  { value: "DCT", label: "DCT" },
  { value: "Otra", label: "Otra" },
];

export const ADMIN_DRIVETRAIN_OPTIONS: AdminSelectOption[] = [
  { value: "FWD", label: "FWD" },
  { value: "RWD", label: "RWD" },
  { value: "AWD", label: "AWD" },
  { value: "4WD", label: "4WD" },
  { value: "Otro", label: "Otro" },
];

export const ADMIN_FUEL_OPTIONS: AdminSelectOption[] = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diésel", label: "Diésel" },
  { value: "Híbrido", label: "Híbrido" },
  { value: "Híbrido enchufable", label: "Híbrido enchufable" },
  { value: "Eléctrico", label: "Eléctrico" },
  { value: "Otro", label: "Otro" },
];

export const ADMIN_CONDITION_OPTIONS: AdminSelectOption[] = [
  { value: "Excelente", label: "Excelente" },
  { value: "Muy bueno", label: "Muy bueno" },
  { value: "Bueno", label: "Bueno" },
  { value: "Regular", label: "Regular" },
];

export const ADMIN_EXTERIOR_COLOR_OPTIONS: AdminSelectOption[] = [
  { value: "Blanco", label: "Blanco" },
  { value: "Negro", label: "Negro" },
  { value: "Gris", label: "Gris" },
  { value: "Plata", label: "Plata" },
  { value: "Azul", label: "Azul" },
  { value: "Rojo", label: "Rojo" },
  { value: "Verde", label: "Verde" },
  { value: "Marrón", label: "Marrón" },
  { value: "Beige", label: "Beige" },
  { value: "Otro", label: "Otro" },
];

export const ADMIN_BODY_STYLE_OPTIONS: AdminSelectOption[] = [
  { value: "SUV", label: "SUV" },
  { value: "Sedan", label: "Sedan" },
  { value: "Pickup", label: "Pickup" },
  { value: "Coupe", label: "Coupe" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Minivan", label: "Minivan" },
  { value: "Wagon", label: "Wagon" },
  { value: "Convertible", label: "Convertible" },
  { value: "Van", label: "Van" },
  { value: "Otro", label: "Otro" },
];

export const ADMIN_TITLE_STATUS_OPTIONS: AdminSelectOption[] = [
  { value: "Limpio", label: "Limpio" },
  { value: "Salvage", label: "Salvage" },
  { value: "Reconstruido", label: "Reconstruido" },
  { value: "Solo piezas", label: "Solo piezas" },
];

/** Sentinel used when the owner picks "Otro" and types a custom value. */
export const ADMIN_OTHER_SENTINEL = "__other__";

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

export function isPresetOption(options: AdminSelectOption[], current: string | null | undefined) {
  const value = (current ?? "").trim();
  if (!value) return true;
  return options.some((option) => option.value === value && option.value !== "Otro" && option.value !== "Otra");
}

export function selectValueForField(
  options: AdminSelectOption[],
  current: string,
  otherSentinel = ADMIN_OTHER_SENTINEL,
) {
  const trimmed = current.trim();
  if (!trimmed) return "";
  if (options.some((option) => option.value === trimmed && option.value !== "Otro" && option.value !== "Otra")) {
    return trimmed;
  }
  if (trimmed === "Otro" || trimmed === "Otra") {
    return otherSentinel;
  }
  // Custom historical values (e.g. Delantera, Dual clutch) stay selectable via withCurrentOption path,
  // but for Other-aware fields we treat unknowns as custom when "Otro"/"Otra" exists.
  const hasOther = options.some((option) => option.value === "Otro" || option.value === "Otra");
  if (hasOther && !options.some((option) => option.value === trimmed)) {
    return otherSentinel;
  }
  return trimmed;
}
