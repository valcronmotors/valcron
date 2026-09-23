import { PageHero } from "@/components/public/PageHero";
import { VehicleCatalog } from "@/components/public/VehicleCatalog";
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

export default async function InventarioPage({
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

  return (
    <main>
      <PageHero
        kicker="Inventario"
        title="Vehículos disponibles"
        subtitle="Filtra por marca, modelo, año, precio o tipo de listado. El catálogo se sincroniza con el inventario de Valcron Motors."
        image={PAGE_HERO_IMAGES.inventario}
        imageAlt={PAGE_HERO_ALTS.inventario}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <VehicleCatalog
            initialVehicles={inventory.data}
            initialError={inventory.error}
            initialFilters={{
              listing: firstParam(params.listing),
              marca: firstParam(params.marca),
              modelo: firstParam(params.modelo),
              ano: firstParam(params.ano),
              precioMin: firstParam(params.precioMin),
              precioMax: firstParam(params.precioMax),
              search: firstParam(params.q),
            }}
          />
        </div>
      </section>
    </main>
  );
}
