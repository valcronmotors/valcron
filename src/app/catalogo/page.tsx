import { PublicShell } from "@/components/public/SiteChrome";
import { VehicleCatalog } from "@/components/public/VehicleCatalog";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario",
  description: `Inventario de ${SITE.name} para venta local e importación directa desde Copart y Manheim.`,
};

export default function CatalogoPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          Inventario público
        </p>
        <h1 className="mt-3 font-display text-4xl text-[#F4F5F7]">Vehículos Disponibles y en subasta</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A909A]">
          Stock en Santo Domingo Este e importación por encargo desde Copart y Manheim.
        </p>
        <div className="mt-10">
          <VehicleCatalog />
        </div>
      </main>
    </PublicShell>
  );
}
