import { describe, expect, it } from "vitest";
import { positionAdminMenu } from "@/lib/admin-action-menu";

describe("positionAdminMenu", () => {
  it("forces a bottom sheet on mobile/tablet widths", () => {
    const result = positionAdminMenu({
      trigger: { top: 200, right: 360, bottom: 240, left: 320 },
      menu: { width: 240, height: 280 },
      viewport: { width: 390, height: 844 },
    });
    expect(result.mode).toBe("sheet");
    expect(result.width).toBe(390);
  });

  it("keeps an anchored menu within the desktop viewport", () => {
    const result = positionAdminMenu({
      trigger: { top: 80, right: 1200, bottom: 120, left: 1160 },
      menu: { width: 240, height: 220 },
      viewport: { width: 1440, height: 900 },
    });
    expect(result.mode).toBe("menu");
    expect(result.left + result.width).toBeLessThanOrEqual(1440);
    expect(result.top).toBeGreaterThanOrEqual(0);
  });
});
