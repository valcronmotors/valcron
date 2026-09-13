import { PageHero } from "@/components/public/PageHero";
import { VehicleCatalog } from "@/components/public/VehicleCatalog";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inventario",
  description: `Inventario completo de ${SITE.name}: unidades disponibles en RD y en subasta Copart / Manheim.`,
};

export default function InventarioPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Inventario"
          title="Catálogo completo"
          subtitle="Filtra por estado, marca, año, rango de precio o VIN. Cada unidad incluye especificaciones, precio en USD/DOP y consulta directa por WhatsApp."
          image={PAGE_HERO_IMAGES.inventario}
          imageAlt={PAGE_HERO_ALTS.inventario}
        />
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Suspense
            fallback={
              <p className="rounded-2xl border border-line px-6 py-12 text-center text-sm text-muted">
                Cargando inventario...
              </p>
            }
          >
            <VehicleCatalog />
          </Suspense>
        </section>
      </main>
    </>
  );
}
