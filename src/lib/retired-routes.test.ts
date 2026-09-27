import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RETIRED_API_ROUTES, RETIRED_WEBSITE_ROUTES } from "@/lib/retired-routes";

describe("legacy website surface", () => {
  it("keeps retired UI paths listed for redirects", () => {
    expect(RETIRED_WEBSITE_ROUTES).toEqual(["/crm", "/vehiculos", "/repuestos"]);
  });

  it("removes retired API route modules from the app", () => {
    expect(RETIRED_API_ROUTES).toEqual([
      "/api/scrape-auction",
      "/api/webhooks/meta",
      "/api/public/parts",
    ]);
    expect(existsSync(resolve("src/app/api/scrape-auction/route.ts"))).toBe(false);
    expect(existsSync(resolve("src/app/api/webhooks/meta/route.ts"))).toBe(false);
    expect(existsSync(resolve("src/app/api/public/parts/route.ts"))).toBe(false);
  });
});
