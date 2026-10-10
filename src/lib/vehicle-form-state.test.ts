import { describe, expect, it } from "vitest";
import { vehicleCreateDefaults } from "@/lib/vehicle-form-state";
import {
  beginVehicleSubmit,
  clearVehicleDraft,
  createFormDoesNotCollectStatus,
  emptyVehicleFormValues,
  endVehicleSubmit,
  isVehicleDraftExpired,
  omitUnusedVehicleColumns,
  preserveVehicleFormValues,
  readVehicleDraft,
  validateVehicleFormValues,
  VEHICLE_DRAFT_TTL_MS,
  VEHICLE_FORM_ERRORS,
  vehicleFormDataFromValues,
  writeVehicleDraft,
} from "@/lib/vehicle-form-state";
import {
  peekFailedVehiclePhotos,
  resetFailedVehiclePhotos,
  stashFailedVehiclePhotos,
  takeFailedVehiclePhotos,
} from "@/lib/vehicle-photo-retry";

function memoryStorage(initial: Record<string, string> = {}) {
  const store = { ...initial };
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
}

describe("create vehicle defaults", () => {
  it("defaults to unpublished without forcing draft status", () => {
    expect(vehicleCreateDefaults()).toEqual({
      published: false,
      published_at: null,
    });
  });

  it("does not require title or location", () => {
    const values = emptyVehicleFormValues(new Date("2026-09-27T12:00:00"));
    values.year = "2021";
    values.make = "Honda";
    values.model = "Civic";
    const result = validateVehicleFormValues(values);
    expect(result.ok).toBe(true);
    expect(vehicleFormDataFromValues(values).has("title_status")).toBe(false);
    expect(vehicleFormDataFromValues(values).has("location")).toBe(false);
  });

  it("does not send status from the create form", () => {
    const keys = [...vehicleFormDataFromValues(emptyVehicleFormValues()).keys()];
    expect(createFormDoesNotCollectStatus(keys)).toBe(true);
    expect(keys).not.toContain("status");
  });
});

describe("vehicle form validation", () => {
  it("keeps every entered value when validation fails", () => {
    const values = {
      ...emptyVehicleFormValues(),
      year: "12",
      make: "Toyota",
      model: "RAV4",
      trim: "XLE",
      vin: "BADVIN",
      price: "18500",
      description: "Unidad lista para entrega.",
    };
    const before = preserveVehicleFormValues(values);
    const result = validateVehicleFormValues(values);
    expect(result.ok).toBe(false);
    expect(result.fieldErrors.year).toBe(VEHICLE_FORM_ERRORS.year);
    expect(result.fieldErrors.vin).toBe(VEHICLE_FORM_ERRORS.vin);
    expect(values).toEqual(before);
  });

  it("does not reset values when a server error is applied", () => {
    const values = {
      ...emptyVehicleFormValues(),
      year: "2021",
      make: "Honda",
      model: "Civic",
      stock_number: "VM-9",
    };
    const serverError = "Ya existe un vehículo con ese VIN.";
    const next = preserveVehicleFormValues(values);
    expect(next.make).toBe("Honda");
    expect(next.stock_number).toBe("VM-9");
    expect(serverError).toMatch(/VIN/i);
  });

  it("uses professional Spanish messages", () => {
    const empty = validateVehicleFormValues({ ...emptyVehicleFormValues(), year: "", make: "", model: "" });
    expect(empty.fieldErrors.year).toBe("Ingresa el año del vehículo.");
    expect(empty.fieldErrors.make).toBe("Ingresa la marca.");
    expect(empty.fieldErrors.model).toBe("Ingresa el modelo.");
    expect(validateVehicleFormValues({ ...emptyVehicleFormValues(), year: "2021", make: "Honda", model: "Civic", price: "0" }).fieldErrors.price).toBe(
      "El precio debe ser mayor que cero.",
    );
  });
});

describe("local vehicle draft", () => {
  it("restores a recent draft and clears it after success", () => {
    const storage = memoryStorage();
    const values = { ...emptyVehicleFormValues(), make: "Toyota", model: "Camry", year: "2020" };
    writeVehicleDraft(storage, values, 1_000);
    expect(readVehicleDraft(storage, 2_000)?.make).toBe("Toyota");
    clearVehicleDraft(storage);
    expect(readVehicleDraft(storage, 3_000)).toBeNull();
  });

  it("ignores an expired draft", () => {
    const storage = memoryStorage();
    writeVehicleDraft(storage, { ...emptyVehicleFormValues(), make: "Honda" }, 1_000);
    expect(isVehicleDraftExpired(1_000, 1_000 + VEHICLE_DRAFT_TTL_MS + 1)).toBe(true);
    expect(readVehicleDraft(storage, 1_000 + VEHICLE_DRAFT_TTL_MS + 1)).toBeNull();
  });
});

describe("double submit", () => {
  it("prevents a second submit while the first is in flight", () => {
    const lock = { current: false };
    expect(beginVehicleSubmit(lock)).toBe(true);
    expect(beginVehicleSubmit(lock)).toBe(false);
    endVehicleSubmit(lock);
    expect(beginVehicleSubmit(lock)).toBe(true);
  });
});

describe("legacy columns", () => {
  it("omits title and location from writes without requiring them", () => {
    expect(
      omitUnusedVehicleColumns({
        make: "Honda",
        title_status: "Clean",
        location: "Av Principal 20",
      }),
    ).toEqual({ make: "Honda" });
  });
});

describe("photo retry after partial upload", () => {
  it("keeps failed local photos for retry and leaves successful ones attached", () => {
    resetFailedVehiclePhotos();
    const failed = new File(["x"], "side.webp", { type: "image/webp" });
    stashFailedVehiclePhotos("veh-1", [{ file: failed, alt: "Lateral", isCover: false }]);
    expect(peekFailedVehiclePhotos("veh-1")).toHaveLength(1);
    const restored = takeFailedVehiclePhotos("veh-1");
    expect(restored[0]?.file.name).toBe("side.webp");
    expect(takeFailedVehiclePhotos("veh-1")).toEqual([]);
  });
});

describe("photo selection survives validation", () => {
  it("does not clear a local photo list when the form is invalid", () => {
    const photos = [{ id: "local-1", name: "front.webp" }];
    const values = { ...emptyVehicleFormValues(), make: "", model: "", year: "" };
    const result = validateVehicleFormValues(values);
    expect(result.ok).toBe(false);
    expect(photos).toHaveLength(1);
  });
});
