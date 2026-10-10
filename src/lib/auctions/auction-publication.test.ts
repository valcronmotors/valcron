import { describe, expect, it } from "vitest";
import {
  auctionPublicationBlockMessage,
  auctionPublicationChecks,
  auctionPublishButtonLabel,
  canPublishAuctionOpportunity,
} from "@/lib/auctions/auction-publication";
import { vehiclePublicationChecks, canPublishVehicleListing } from "@/lib/publication-readiness";

const ELIGIBLE_BASE = {
  provider: "copart" as const,
  provider_lot_id: "60659246",
  year: 2026,
  make: "Honda",
  model: "CR-V",
  location: "TN - MEMPHIS",
  price_mode: "contact" as const,
  hasCoverPhoto: true,
  vin: "1HGCM82633A004352",
  title_status: "Salvage Title",
  odometer_status: "Actual",
  primary_damage: "Normal Wear",
  secondary_damage: "None",
  run_and_drive: "Run and Drive",
};

describe("auction publication validation", () => {
  it("does not require local inventory availability status", () => {
    const checks = auctionPublicationChecks(ELIGIBLE_BASE);
    expect(canPublishAuctionOpportunity(checks)).toBe(true);
    expect(checks.some((check) => /Disponible|reservado|vendido/i.test(check.label))).toBe(false);
    expect(auctionPublicationBlockMessage(ELIGIBLE_BASE)).toBeNull();
  });

  it("blocks incomplete auction records without inventing values", () => {
    const message = auctionPublicationBlockMessage({
      ...ELIGIBLE_BASE,
      provider_lot_id: "",
      year: null,
      make: "",
      model: "",
      hasCoverPhoto: false,
      vin: "",
      title_status: "",
      odometer_status: "",
      primary_damage: "",
      run_and_drive: "",
    });
    expect(message).toMatch(/VIN incompleto|Completar revisión|Publicación bloqueada/i);
    expect(message).not.toMatch(/Disponible, reservado o vendido/i);
  });

  it("blocks direct publication when eligibility fails even if structural fields are complete", () => {
    const message = auctionPublicationBlockMessage({
      ...ELIGIBLE_BASE,
      vin: "JHM***",
    });
    expect(message).toMatch(/no comienza con 1, 4, 5 o 7/i);
    expect(auctionPublishButtonLabel({ ...ELIGIBLE_BASE, vin: "7FARS6H97TE******" })).toBe(
      "Publicar oportunidad",
    );
    expect(auctionPublishButtonLabel({ ...ELIGIBLE_BASE, title_status: "Junk" })).toBe(
      "Publicación bloqueada",
    );
    expect(auctionPublishButtonLabel(ELIGIBLE_BASE)).toBe("Publicar oportunidad");
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
