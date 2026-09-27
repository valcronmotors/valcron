import { describe, expect, it } from "vitest";
import {
  draftExposesInternalNotes,
  opportunityToVehicleDraft,
  publicVehicleKeysFromDraft,
  reusableWebsiteVehicleId,
} from "@/lib/auctions/prepare-website";
import { isAuctionOpportunityPublic, parseAuctionSourceUrl } from "@/lib/auctions/url";
import { publicActionError } from "@/lib/action-errors";
import { isSafeHttpUrl } from "@/lib/safe-url";

describe("auction provider URL detection", () => {
  it("detects Copart lot from URL only", () => {
    const parsed = parseAuctionSourceUrl("https://www.copart.com/lot/12345678");
    expect(parsed.data?.provider).toBe("copart");
    expect(parsed.data?.providerLotId).toBe("12345678");
    expect(parsed.extraction).toBe("NOT_CONFIGURED");
  });

  it("detects IAA vehicle detail URLs", () => {
    const parsed = parseAuctionSourceUrl("https://www.iaai.com/VehicleDetail/5555555");
    expect(parsed.data?.provider).toBe("iaa");
    expect(parsed.data?.providerLotId).toBe("5555555");
  });

  it("still recognizes a historical Manheim URL without advertising it", () => {
    const parsed = parseAuctionSourceUrl("https://www.manheim.com/member/inventory?lot=99001");
    expect(parsed.data?.provider).toBe("manheim");
    expect(parseAuctionSourceUrl("").error).toMatch(/Copart o IAA/);
    expect(parseAuctionSourceUrl("").error).not.toMatch(/Manheim/);
  });

  it("does not scrape a bare lot number", () => {
    const parsed = parseAuctionSourceUrl("12345678");
    expect(parsed.data).toBeNull();
    expect(parsed.error).toMatch(/URL completa/i);
  });

  it("accepts only http(s) source URLs", () => {
    expect(isSafeHttpUrl("https://www.copart.com/lot/1")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("/lot/1")).toBe(false);
  });
});

describe("auction draft is not public", () => {
  it("never treats an opportunity as public inventory", () => {
    expect(isAuctionOpportunityPublic("draft")).toBe(false);
    expect(isAuctionOpportunityPublic("published")).toBe(false);
    expect(isAuctionOpportunityPublic("published", false)).toBe(false);
  });
});

describe("prepare-for-website flow", () => {
  const opportunity = {
    vin: "1HGCM82633A004352",
    year: 2019,
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    mileage: 41000,
    title_status: "Salvage",
    location: "Florida",
    primary_damage: "Front",
    internal_notes: "SECRET DEALER NOTE",
    provider: "copart" as const,
    provider_lot_id: "99",
    auction_metadata: {
      sellerName: "SECRET SELLER",
      repairCost: 9999,
      buyItNowPrice: 1234,
    },
  };

  it("creates an unpublished vehicle draft without internal notes", () => {
    const result = opportunityToVehicleDraft(opportunity);
    expect(result.data?.published).toBe(false);
    expect(result.data?.status).toBe("draft");
    expect(result.data?.source_type).toBe("other");
    expect(result.data?.public_price_mode).toBe("contact");
    expect(result.data?.price).toBeNull();
    expect(draftExposesInternalNotes(result.data)).toBe(false);
    expect(JSON.stringify(result.data)).not.toContain("SECRET DEALER NOTE");
    expect(JSON.stringify(result.data)).not.toContain("SECRET SELLER");
    expect(JSON.stringify(result.data)).not.toContain("9999");
    expect(JSON.stringify(publicVehicleKeysFromDraft(result.data!))).not.toContain("internal_notes");
  });

  it("requires year, make, and model", () => {
    const result = opportunityToVehicleDraft({
      ...opportunity,
      year: null,
      make: null,
      model: null,
    });
    expect(result.data).toBeNull();
    expect(result.error).toMatch(/año, marca y modelo/i);
  });

  it("reuses an already linked vehicle instead of creating another draft", () => {
    expect(reusableWebsiteVehicleId({ linked_vehicle_id: "veh-1" })).toBe("veh-1");
    expect(reusableWebsiteVehicleId({ linked_vehicle_id: null })).toBeNull();
  });
});

describe("duplicate auction lots", () => {
  it("maps unique provider+lot collisions to dealer language", () => {
    expect(
      publicActionError(
        { code: "23505", message: 'duplicate key value violates unique constraint "auction_opportunities_provider_lot_uidx"' },
        "No se pudo guardar.",
      ),
    ).toBe("Este lote ya está en tus oportunidades.");
  });
});
