import { Suspense } from "react";
import { PageContainer } from "@/components/public/layout";
import { CatalogSkeleton } from "@/components/public/InventorySkeleton";
import { VehicleCatalog, type CatalogFilters } from "@/components/public/VehicleCatalog";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Inventario de Vehículos",
  description:
    "Vehículos disponibles en Valcron Motors, Santo Domingo Este. Filtra por marca, modelo y año.",
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
    <main className="section-light bg-[#f7f8fa]">
      <PageContainer className="pb-14 pt-8 md:pb-16 md:pt-10">
        <p className="kicker !text-[#676a70]">Inventario</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
          Vehículos
        </h1>
        <div className="mt-6 md:mt-8">
          <Suspense fallback={<CatalogSkeleton />}>
            <InventarioCatalog searchParams={searchParams} />
          </Suspense>
        </div>
      </PageContainer>
    </main>
  );
}
