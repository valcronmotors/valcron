import { describe, expect, it } from "vitest";
import {
  auctionFeesTotalUsd,
  auctionPublicPriceUsd,
  isMissingAuctionPurchaseColumn,
  parseAuctionPurchaseEstimate,
  vehicleSelectWithoutAuctionPurchase,
} from "./auction-price";

describe("auction public price (compra + fees + US$1,500)", () => {
  it("applies the Copart fee schedule and the US$1,500 profit", () => {
    // Compra 400: buyer fee 175 (tramo <500) + internet 79 (tramo <1000) + fijo 130.
    expect(auctionFeesTotalUsd(400, "copart")).toBe(384);
    expect(auctionPublicPriceUsd(400, "copart")).toBe(2284);
  });

  it("applies the IAAI fixed fee and internet cap", () => {
    // Compra 400: buyer 175 + internet 79 (tope 160) + fijo 140.
    expect(auctionFeesTotalUsd(400, "iaai")).toBe(394);
    expect(auctionPublicPriceUsd(400, "iaai")).toBe(2294);
  });

  it("returns null without a valid purchase estimate", () => {
    expect(auctionPublicPriceUsd(null, "copart")).toBeNull();
    expect(auctionPublicPriceUsd(0, "copart")).toBeNull();
    expect(auctionPublicPriceUsd(-5, "copart")).toBeNull();
  });
});

describe("parseAuctionPurchaseEstimate", () => {
  it("accepts empty as clearing the value", () => {
    expect(parseAuctionPurchaseEstimate("")).toEqual({
      data: { auction_purchase_estimate_usd: null },
    });
  });

  it("accepts a positive amount and rejects invalid input", () => {
    expect(parseAuctionPurchaseEstimate("12000")).toEqual({
      data: { auction_purchase_estimate_usd: 12000 },
    });
    expect(parseAuctionPurchaseEstimate("abc")).toHaveProperty("error");
    expect(parseAuctionPurchaseEstimate("-1")).toHaveProperty("error");
  });
});

describe("missing column fallback", () => {
  it("detects the pending-migration error and strips the column", () => {
    expect(
      isMissingAuctionPurchaseColumn({
        message: "column vehicles.auction_purchase_estimate_usd does not exist",
      }),
    ).toBe(true);
    expect(isMissingAuctionPurchaseColumn({ message: "other error" })).toBe(false);
    expect(
      vehicleSelectWithoutAuctionPurchase("id, auction_purchase_estimate_usd, price"),
    ).toBe("id, price");
  });
});
