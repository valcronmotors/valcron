import { describe, expect, it } from "vitest";
import {
  auctionPublicationBlockMessage,
  auctionPublicationChecks,
  canPublishAuctionOpportunity,
} from "@/lib/auctions/auction-publication";
import { vehiclePublicationChecks, canPublishVehicleListing } from "@/lib/publication-readiness";

describe("auction publication validation", () => {
  it("does not require local inventory availability status", () => {
    const checks = auctionPublicationChecks({
      provider: "copart",
      provider_lot_id: "60659246",
      year: 2026,
      make: "Honda",
      model: "CR-V",
      location: "TN - MEMPHIS",
      price_mode: "contact",
      hasCoverPhoto: true,
    });
    expect(canPublishAuctionOpportunity(checks)).toBe(true);
    expect(checks.some((check) => /Disponible|reservado|vendido/i.test(check.label))).toBe(false);
    expect(auctionPublicationBlockMessage({
      provider: "copart",
      provider_lot_id: "60659246",
      year: 2026,
      make: "Honda",
      model: "CR-V",
      price_mode: "contact",
      hasCoverPhoto: true,
    })).toBeNull();
  });

  it("blocks incomplete auction records without inventing values", () => {
    const message = auctionPublicationBlockMessage({
      provider: "copart",
      provider_lot_id: "",
      year: null,
      make: "",
      model: "",
      price_mode: "contact",
      hasCoverPhoto: false,
    });
    expect(message).toMatch(/Número de lote/i);
    expect(message).toMatch(/Año, marca y modelo/i);
    expect(message).toMatch(/Foto de portada/i);
    expect(message).not.toMatch(/Disponible, reservado o vendido/i);
  });

  it("keeps local inventory validation unchanged for stock vehicles", () => {
    const local = vehiclePublicationChecks({
      year: 2021,
      make: "Honda",
      model: "CR-V",
      description: "Unidad lista para entrega en Santo Domingo Este.",
      price: 18900,
      public_price_mode: "fixed",
      source_type: "valcron_stock",
      status: "draft",
      photos: [{ id: "1", is_cover: true } as never],
    });
    expect(canPublishVehicleListing(local)).toBe(false);
    expect(local.some((check) => check.id === "status" && !check.ok)).toBe(true);
  });
});
