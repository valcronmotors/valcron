import { describe, expect, it } from "vitest";
import { publicVehicleDescription } from "@/lib/vehicles/public-description";

describe("public vehicle descriptions", () => {
  it("removes existing auction notices while retaining price, mileage, model and location", () => {
    expect(publicVehicleDescription("Honda Civic Sport 2024. Kilometraje: 39,955 millas. Daño principal: Minor Dent/Scratches. Estado: Run and Drive. Ubicación: CA – Bakersfield. Precio a consultar. VIN no legible en la documentación disponible. PUBLICABLE CON ADVERTENCIAS. Condición del odómetro Actual no confirmada.")).toBe("Honda Civic Sport 2024. Kilometraje: 39,955 millas. Ubicación: CA – Bakersfield. Precio a consultar.");
  });

  it.each(["Daño secundario: Side.", "Tipo de título por confirmar.", "Advertencia: revisar el motor.", "Warning: engine issue.", "Airbags: Deployed.", "Bolsas de aire desplegadas.", "Condición: reparado."])("omits internal notice %s", (notice) => {
    expect(publicVehicleDescription(`SUV familiar. ${notice} Techo panorámico.`)).toBe("SUV familiar. Techo panorámico.");
  });

  it("preserves ordinary descriptions, safety equipment, decimals and paragraph formatting", () => {
    const description = "Motor 2.0 L. Airbags frontales y laterales.\n\nTecho panorámico y asientos de piel.";
    expect(publicVehicleDescription(description)).toBe(description);
    expect(publicVehicleDescription(null)).toBeNull();
    expect(publicVehicleDescription("PUBLICABLE CON ADVERTENCIAS.")).toBeNull();
  });
});
