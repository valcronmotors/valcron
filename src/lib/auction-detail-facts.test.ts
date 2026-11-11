import { describe, expect, it } from "vitest";
import { auctionDetailFacts, confirmedAuctionRunAndDrive } from "./auction-detail-facts";

describe("compact auction facts", () => {
  it("uses recorded mileage and only affirmative lot statuses", () => {
    expect(auctionDetailFacts(39955, "mi", confirmedAuctionRunAndDrive("Reported Run and Drive"))).toBe("39,955 millas · Run and Drive");
    expect(confirmedAuctionRunAndDrive("Run and Drive")).toBe(true);
    for (const value of [null, "Not Reported", "Not Run and Drive", "Run and Drive: No", "Engine Starts"]) expect(confirmedAuctionRunAndDrive(value)).toBe(false);
  });
  it("does not invent missing mileage or a Run and Drive status", () => {
    expect(auctionDetailFacts(54729, "mi", false)).toBe("54,729 millas");
    expect(auctionDetailFacts(null, "mi", false)).toBe("");
    expect(auctionDetailFacts(NaN, "mi", true)).toBe("Run and Drive");
    expect(auctionDetailFacts(0, "mi", true)).toBe("0 millas · Run and Drive");
  });
  it("converts an actual kilometer reading rather than mislabeling it as miles", () => {
    expect(auctionDetailFacts(16093.44, "km", true)).toBe("10,000 millas · Run and Drive");
  });
});
