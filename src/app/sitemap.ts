import type { MetadataRoute } from "next";
import { listArticles, contentPath } from "@/lib/content";
import { SITE } from "@/lib/site";
import { getPublicSitemapVehicles } from "@/lib/vehicles/adapter";

const STATIC_PATHS = [
  "/",
  "/inventario",
  "/comprar",
  "/subastas",
  "/importacion",
  "/financiamiento",
  "/servicios",
  "/nosotros",
  "/contacto",
  "/blog",
  "/guias",
  "/preguntas-frecuentes",
  "/calculadoras",
  "/calculadoras/financiamiento",
  "/calculadoras/importacion",
  "/calculadoras/subasta",
  "/mapa-del-sitio",
  "/privacidad",
  "/terminos",
  "/cookies",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE.url : `${SITE.url}${path}`,
  }));

  const blogEntries: MetadataRoute.Sitemap = listArticles("blog").map((article) => ({
    url: `${SITE.url}${contentPath(article)}`,
    lastModified: article.updatedAt,
  }));

  const guideEntries: MetadataRoute.Sitemap = listArticles("guide").map((article) => ({
    url: `${SITE.url}${contentPath(article)}`,
    lastModified: article.updatedAt,
  }));

  let vehicleEntries: MetadataRoute.Sitemap = [];
  try {
    const vehicles = await getPublicSitemapVehicles();
    vehicleEntries = (vehicles.data ?? []).map((vehicle) => ({
      url: `${SITE.url}/inventario/${vehicle.slug}`,
      lastModified: vehicle.updatedAt ?? vehicle.publishedAt ?? undefined,
    }));
  } catch {
    // Preview / local builds without public Supabase config still emit static routes.
  }

  return [...staticEntries, ...blogEntries, ...guideEntries, ...vehicleEntries];
}
