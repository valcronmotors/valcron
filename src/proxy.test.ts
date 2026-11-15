import { describe, expect, it, vi } from "vitest";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
vi.mock("./utils/supabase/middleware", () => ({ updateSession: vi.fn() }));
import { config } from "./proxy";
describe("quote font asset routing", () => {
  it("serves the two public PDF fonts without authentication middleware", () => {
    for (const style of ["Regular", "Bold"])
      expect(
        unstable_doesMiddlewareMatch({
          config,
          url: `https://www.valcronmotors.com/fonts/quote/ValcronQuote-${style}.ttf`,
        }),
      ).toBe(false);
  });
  it("keeps admin and unrelated paths behind the existing middleware", () => {
    for (const path of [
      "/admin",
      "/admin/vehicles.ttf",
      "/api/private",
      "/fonts/quote/private",
      "/fonts/quote/ValcronQuote-Regular.ttf/private",
    ])
      expect(
        unstable_doesMiddlewareMatch({
          config,
          url: `https://www.valcronmotors.com${path}`,
        }),
      ).toBe(true);
  });
});
