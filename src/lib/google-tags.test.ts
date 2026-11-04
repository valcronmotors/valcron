import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { GOOGLE_ADS_ID, GOOGLE_TAG_BOOTSTRAP, WHATSAPP_CONVERSION_DESTINATION } from "@/lib/google-tags";
import { isAdminPublicPath, isPublicPath } from "@/lib/site";

function browserFixture() {
  const listeners = new Map<string, (event: unknown) => void>();
  const addEventListener = vi.fn((type: string, handler: (event: unknown) => void) => {
    listeners.set(type, handler);
  });
  const window = {
    location: new URL("https://www.valcronmotors.com/inventario/vehiculo-1"),
    dataLayer: [] as Array<ArrayLike<unknown>>,
  };
  const context = { window, document: { addEventListener }, URL };
  const bootstrap = () => runInNewContext(GOOGLE_TAG_BOOTSTRAP, context);
  bootstrap();
  const click = (href: string | null, type = "click", button = 0) => {
    const link = href === null ? null : { href };
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    // A nested icon resolves to its surrounding anchor through closest().
    listeners.get(type)?.({ type, button, target: { nodeType: 1, closest: () => link }, preventDefault, stopPropagation });
    return { preventDefault, stopPropagation };
  };
  const conversions = () => window.dataLayer.map((args) => Array.from(args)).filter((args) => args[0] === "event");
  return { window, addEventListener, bootstrap, click, conversions };
}

describe("Google Ads WhatsApp conversion", () => {
  it("lets Google read ads.txt without opening private routes or similarly named paths", () => {
    expect(isPublicPath("/ads.txt")).toBe(true);
    for (const path of ["/ads.txt/private", "/ads.txt-backup", "/admin", "/admin/inventario", "/api/admin/vehicle-images"]) expect(isPublicPath(path)).toBe(false);
    expect(isAdminPublicPath("/ads.txt")).toBe(false);
  });

  it("initializes the requested account and registers each delegated listener only once", () => {
    const fixture = browserFixture();
    fixture.bootstrap();
    expect(fixture.window.dataLayer.map((args) => Array.from(args)).filter((args) => args[0] === "config")).toEqual([["config", GOOGLE_ADS_ID]]);
    expect(fixture.addEventListener).toHaveBeenCalledTimes(2);
    expect(fixture.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), { capture: true, passive: true });
  });

  it.each(["https://wa.me/18293211271", "https://wa.me/18492572225", "https://api.whatsapp.com/send?phone=18293211271"])("tracks %s without interfering with navigation", (href) => {
    const fixture = browserFixture();
    const event = fixture.click(href);
    expect(fixture.conversions()).toEqual([["event", "conversion", { send_to: WHATSAPP_CONVERSION_DESTINATION }]]);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });

  it("deduplicates repeated clicks and remounted links on a page while supporting SPA navigation", () => {
    const fixture = browserFixture();
    const href = "https://wa.me/18293211271";
    fixture.click(href);
    fixture.click(href);
    fixture.click(href, "auxclick", 1);
    expect(fixture.conversions()).toHaveLength(1);
    fixture.window.location = new URL("https://www.valcronmotors.com/subastas/vehiculo-2");
    fixture.click(href);
    expect(fixture.conversions()).toHaveLength(2);
  });

  it("ignores unrelated links and right clicks", () => {
    const fixture = browserFixture();
    for (const href of [null, "/inventario", "https://example.com/?next=wa.me/123", "https://wa.me.example.com/123", "javascript:void(0)"]) fixture.click(href);
    fixture.click("https://wa.me/18293211271", "auxclick", 2);
    expect(fixture.conversions()).toHaveLength(0);
  });
});
