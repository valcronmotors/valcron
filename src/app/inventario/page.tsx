import { Suspense } from "react";
import { PageContainer } from "@/components/public/layout";
import { CatalogSkeleton } from "@/components/public/InventorySkeleton";
import { VehicleCatalog, type CatalogFilters } from "@/components/public/VehicleCatalog";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Inventario de Vehículos",
  description:
    "Vehículos disponibles en Valcron Motors, Santo Domingo Este, y unidades mediante subasta. Filtra por marca, modelo y año.",
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
    <main className="section-light bg-[#f5f6f7]">
      <PageContainer className="pb-14 pt-10 md:pb-20 md:pt-14">
        <header className="max-w-[40rem]">
          <p className="kicker">Inventario</p>
          <h1 className="display-lg mt-3 text-[#08090b]">Vehículos disponibles</h1>
          <p className="mt-4 text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
            Filtra por marca, modelo, año o precio. El catálogo refleja el inventario publicado de
            Valcron Motors.
          </p>
        </header>
        <div className="mt-8 md:mt-10">
          <Suspense fallback={<CatalogSkeleton />}>
            <InventarioCatalog searchParams={searchParams} />
          </Suspense>
        </div>
      </PageContainer>
    </main>
  );
}
