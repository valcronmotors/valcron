import { describe, expect, it } from "vitest";
import {
  VEHICLE_MAKE_OPTIONS,
  findKnownMake,
  isKnownModelForMake,
  makeChangeConflictsWithModel,
  modelsForMake,
  yearOptions,
} from "@/lib/vehicle-make-models";
import {
  makeSelectState,
  modelSelectState,
  resolveMakeValue,
  resolveModelValue,
  resolveSmartFieldValue,
  smartFieldState,
} from "@/lib/admin-smart-fields";
import { ADMIN_EXTERIOR_COLOR_OPTIONS, ADMIN_OTHER_SENTINEL } from "@/lib/admin-field-options";

describe("vehicle make/model catalog", () => {
  it("includes the Dominican Republic brand set and Kia Sportage", () => {
    expect(VEHICLE_MAKE_OPTIONS).toContain("Kia");
    expect(VEHICLE_MAKE_OPTIONS).toContain("BYD");
    expect(modelsForMake("Kia")).toContain("Sportage");
    expect(modelsForMake("Toyota")).toContain("RAV4");
    expect(findKnownMake("kia")).toBe("Kia");
  });

  it("preserves unknown models for a known make", () => {
    expect(isKnownModelForMake("Kia", "Sportage")).toBe(true);
    expect(isKnownModelForMake("Kia", "Stinger GT")).toBe(false);
    expect(modelSelectState("Kia", "Stinger GT")).toEqual({
      selectValue: "__other_model__",
      customValue: "Stinger GT",
      isOther: true,
    });
  });

  it("detects make changes that conflict with the current model", () => {
    expect(makeChangeConflictsWithModel("Kia", "Toyota", "Sportage")).toBe(true);
    expect(makeChangeConflictsWithModel("Kia", "Toyota", "")).toBe(false);
    expect(makeChangeConflictsWithModel("Kia", "Kia", "Sportage")).toBe(false);
  });

  it("allows years beyond the preset list via custom resolution", () => {
    const years = yearOptions(new Date("2026-10-10"));
    expect(years[0]).toBe(2027);
    expect(years).toContain(2023);
    expect(years.at(-1)).toBe(1980);
  });
});

describe("smart field other values", () => {
  it("keeps custom exterior colors without wiping them", () => {
    expect(smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, "Blanco")).toEqual({
      selectValue: "Blanco",
      customValue: "",
      isOther: false,
    });
    expect(smartFieldState(ADMIN_EXTERIOR_COLOR_OPTIONS, "Perla")).toEqual({
      selectValue: ADMIN_OTHER_SENTINEL,
      customValue: "Perla",
      isOther: true,
    });
    expect(resolveSmartFieldValue(ADMIN_OTHER_SENTINEL, "Perla")).toBe("Perla");
  });

  it("resolves custom make and model values for persistence", () => {
    expect(makeSelectState("Changan")).toEqual({
      selectValue: "Changan",
      customValue: "",
      isOther: false,
    });
    expect(makeSelectState("Great Wall")).toEqual({
      selectValue: "__other_make__",
      customValue: "Great Wall",
      isOther: true,
    });
    expect(resolveMakeValue("__other_make__", "Great Wall")).toBe("Great Wall");
    expect(resolveModelValue("__other_model__", "SX Prestige")).toBe("SX Prestige");
  });
});
