import { describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { publicPageMetadata } from "@/lib/seo";
import { listingQualitySuggestions } from "@/lib/listing-quality";

vi.mock("@/lib/vehicles/adapter", () => ({
  getPublicSitemapVehicles: async () => ({ data: [{ slug: "2023-kia-sportage-example", updatedAt: "2026-10-11", images: [{ url: "/api/public/vehicle-images/example/cover.jpg" }] }] }),
}));

describe("search visibility and listing quality", () => {
  it("includes the lead form and real vehicle cover in the sitemap", async () => {
    const entries = await sitemap();
    expect(entries.some((entry) => entry.url.endsWith("/solicitar-vehiculo"))).toBe(true);
    expect(entries.find((entry) => entry.url.endsWith("/2023-kia-sportage-example"))?.images).toEqual(["https://valcronmotors.com/api/public/vehicle-images/example/cover.jpg"]);
  });
  it("allows public vehicle photos while protecting private API and admin paths", () => {
    const rules = robots().rules as Array<{ allow: string[]; disallow: string[] }>;
    expect(rules[0].allow).toContain("/api/public/vehicle-images/");
    expect(rules[0].disallow).toContain("/api/");
    expect(rules[0].disallow).toContain("/admin");
    expect(rules[0].allow).not.toContain("/api/admin/");
  });
  it("uses each page's own title and description in social metadata", () => {
    const metadata = publicPageMetadata({ title: "Importación", description: "Descripción específica", path: "/importacion" });
    expect(metadata.twitter).toMatchObject({ title: "Importación | Valcron Motors", description: "Descripción específica" });
    expect(metadata.openGraph).toMatchObject({ url: "https://valcronmotors.com/importacion" });
  });
  it("identifies missing customer-facing information", () => {
    expect(listingQualitySuggestions({ description: "", vehicle_photos: [] })).toHaveLength(3);
  });
  it("accepts a developed description and real gallery with a cover", () => {
    expect(listingQualitySuggestions({ description: "Información específica de condición, equipamiento, historial disponible y ubicación de esta unidad para orientar al comprador.", vehicle_photos: Array.from({ length: 4 }, (_, index) => ({ storage_path: `vehicle/${index}.jpg`, is_cover: index === 0 })) })).toEqual([]);
  });
});
