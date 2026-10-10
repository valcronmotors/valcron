import { describe, expect, it } from "vitest";
import { auditPublishedAuctionOpportunities } from "@/lib/auctions/eligibility-audit";
import type { AuctionOpportunityRow } from "@/lib/website-schema";

function opportunity(
  overrides: Partial<AuctionOpportunityRow> & {
    linked_vehicle?: { published?: boolean; id?: string } | null;
  },
): AuctionOpportunityRow & { linked_vehicle?: { published?: boolean; id?: string } | null } {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    provider: "copart",
    provider_lot_id: "60659246",
    source_url: null,
    vin: "7FARS6H97TE******",
    year: 2026,
    make: "Honda",
    model: "CR-V",
    trim: null,
    mileage: 12000,
    title_status: "TX — Salvage Vehicle Title",
    primary_damage: "Normal Wear",
    location: "TN - MEMPHIS",
    status: "published",
    linked_vehicle_id: "22222222-2222-4222-8222-222222222222",
    auction_metadata: {
      odometer_status: "Actual",
      secondary_damage: "Not Reported",
      run_and_drive: "Reported Run and Drive",
      price_mode: "contact",
    },
    internal_notes: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as AuctionOpportunityRow & { linked_vehicle?: { published?: boolean; id?: string } | null };
}

describe("published auction eligibility audit", () => {
  it("flags publicly advertised opportunities that fail Valcron policy without deleting them", () => {
    const report = auditPublishedAuctionOpportunities([
      opportunity({
        vin: "JHM***",
        linked_vehicle: { published: true, id: "22222222-2222-4222-8222-222222222222" },
      }),
      opportunity({
        id: "33333333-3333-4333-8333-333333333333",
        vin: "1HGCM82633A004352",
        status: "draft",
        linked_vehicle: { published: false },
      }),
    ]);

    expect(report.totalPublishedWebsite).toBe(1);
    expect(report.failingPublic).toHaveLength(1);
    expect(report.failingPublic[0]?.overall).toBe("blocked");
    expect(report.failingPublic[0]?.reasons.join(" ")).toMatch(/no comienza con 1, 4, 5 o 7/i);
  });

  it("does not treat local inventory rows as auction audit targets", () => {
    const report = auditPublishedAuctionOpportunities([]);
    expect(report.failingPublic).toEqual([]);
    expect(report.totalPublishedWebsite).toBe(0);
  });
});
