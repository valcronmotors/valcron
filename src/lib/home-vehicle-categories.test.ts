import { describe, expect, it } from "vitest";
import { homeVehicleCategories, vehicleMatchesHomeTab } from "@/lib/home-vehicle-categories";

describe("home vehicle categories", () => {
  it("classifies body and fuel without inventing a segment", () => {
    expect(homeVehicleCategories({ bodyType: "SUV", fuelType: "Gasolina" })).toEqual(["suv"]);
    expect(homeVehicleCategories({ bodyType: "Sedán", fuelType: null })).toEqual(["sedan"]);
    expect(homeVehicleCategories({ bodyType: "Pickup", fuelType: "Gasolina" })).toEqual(["truck"]);
    expect(homeVehicleCategories({ bodyType: "SUV", fuelType: "Híbrido" })).toEqual(["suv", "hybrid"]);
    expect(homeVehicleCategories({ bodyType: "Sedán", fuelType: "Eléctrico" })).toEqual([
      "sedan",
      "electric",
    ]);
    expect(homeVehicleCategories({ bodyType: null, fuelType: null })).toEqual([]);
    expect(
      homeVehicleCategories({ bodyType: null, fuelType: "Gasolina", model: "CR-V", trim: "EX" }),
    ).toEqual([]);
    expect(
      homeVehicleCategories({ bodyType: null, fuelType: "Gasolina", model: "Hilux", trim: "Camioneta" }),
    ).toEqual(["truck"]);
  });

  it("keeps plug-in hybrids out of the electric tab", () => {
    const vehicle = { bodyType: "Crossover", fuelType: "Plug-in Hybrid" };
    expect(vehicleMatchesHomeTab(vehicle, "suv")).toBe(true);
    expect(vehicleMatchesHomeTab(vehicle, "hybrid")).toBe(true);
    expect(vehicleMatchesHomeTab(vehicle, "electric")).toBe(false);
    expect(vehicleMatchesHomeTab(vehicle, "all")).toBe(true);
  });
});
