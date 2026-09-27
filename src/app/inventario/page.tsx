import { Suspense } from "react";
import { PageHero } from "@/components/public/PageHero";
import { CatalogSkeleton } from "@/components/public/InventorySkeleton";
import { VehicleCatalog, type CatalogFilters } from "@/components/public/VehicleCatalog";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Inventario de vehículos",
  description: `Inventario de ${SITE.shortName}: vehículos disponibles en República Dominicana y unidades en proceso de subasta o importación.`,
  path: "/inventario",
});

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

async function InventarioCatalog({
  searchParams,
}: {
  searchParams: Promise<{
    listing?: string;
    marca?: string;
    modelo?: string;
    ano?: string;
    precioMin?: string;
    precioMax?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const inventory = await loadPublicVehicles();
  const filters: CatalogFilters = {
    listing: firstParam(params.listing),
    marca: firstParam(params.marca),
    modelo: firstParam(params.modelo),
    ano: firstParam(params.ano),
    precioMin: firstParam(params.precioMin),
    precioMax: firstParam(params.precioMax),
    search: firstParam(params.q),
  };

  return (
    <VehicleCatalog
      initialVehicles={inventory.data}
      initialError={inventory.error}
      initialFilters={filters}
    />
  );
}

export default function InventarioPage({
  searchParams,
}: {
  searchParams: Promise<{
    listing?: string;
    marca?: string;
    modelo?: string;
    ano?: string;
    precioMin?: string;
    precioMax?: string;
    q?: string;
  }>;
}) {
  return (
    <main>
      <PageHero
        kicker="Inventario"
        title="Vehículos disponibles"
        subtitle="Filtra por marca, modelo, año, precio o disponibilidad. El catálogo refleja el inventario publicado de Valcron Motors."
        image={PAGE_HERO_IMAGES.inventario}
        imageAlt={PAGE_HERO_ALTS.inventario}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Suspense fallback={<CatalogSkeleton />}>
            <InventarioCatalog searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
