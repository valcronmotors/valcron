import {
  ADMIN_OTHER_SENTINEL,
  type AdminSelectOption,
} from "@/lib/admin-field-options";
import {
  OTHER_MAKE_VALUE,
  OTHER_MODEL_VALUE,
  findKnownMake,
  isKnownModelForMake,
  makeRequiresCustomInput,
  modelRequiresCustomInput,
} from "@/lib/vehicle-make-models";

export type SmartFieldState = {
  selectValue: string;
  customValue: string;
  isOther: boolean;
};

function isOtherLabel(value: string) {
  return value === "Otro" || value === "Otra";
}

export function smartFieldState(
  options: AdminSelectOption[],
  current: string,
  otherSentinel = ADMIN_OTHER_SENTINEL,
): SmartFieldState {
  const trimmed = current.trim();
  if (!trimmed) {
    return { selectValue: "", customValue: "", isOther: false };
  }
  const exact = options.find((option) => option.value === trimmed);
  if (exact && !isOtherLabel(exact.value)) {
    return { selectValue: trimmed, customValue: "", isOther: false };
  }
  if (exact && isOtherLabel(exact.value)) {
    return { selectValue: otherSentinel, customValue: "", isOther: true };
  }
  return { selectValue: otherSentinel, customValue: trimmed, isOther: true };
}

export function resolveSmartFieldValue(
  selectValue: string,
  customValue: string,
  otherSentinel = ADMIN_OTHER_SENTINEL,
  otherStoredLabel = "Otro",
) {
  if (selectValue !== otherSentinel) {
    return selectValue.trim();
  }
  const custom = customValue.trim();
  return custom || otherStoredLabel;
}

export function makeSelectState(make: string): SmartFieldState {
  const trimmed = make.trim();
  if (!trimmed) return { selectValue: "", customValue: "", isOther: false };
  const known = findKnownMake(trimmed);
  if (known) return { selectValue: known, customValue: "", isOther: false };
  return { selectValue: OTHER_MAKE_VALUE, customValue: trimmed, isOther: true };
}

export function modelSelectState(make: string, model: string): SmartFieldState {
  const trimmed = model.trim();
  if (!trimmed) return { selectValue: "", customValue: "", isOther: false };
  if (makeRequiresCustomInput(make) || modelRequiresCustomInput(make, trimmed)) {
    if (isKnownModelForMake(make, trimmed)) {
      return { selectValue: trimmed, customValue: "", isOther: false };
    }
    return { selectValue: OTHER_MODEL_VALUE, customValue: trimmed, isOther: true };
  }
  return { selectValue: trimmed, customValue: "", isOther: false };
}

export function resolveMakeValue(selectValue: string, customValue: string) {
  if (selectValue !== OTHER_MAKE_VALUE) return selectValue.trim();
  return customValue.trim();
}

export function resolveModelValue(selectValue: string, customValue: string) {
  if (selectValue !== OTHER_MODEL_VALUE) return selectValue.trim();
  return customValue.trim();
}
