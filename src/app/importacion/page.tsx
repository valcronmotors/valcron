import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = publicPageMetadata({
  title: "Importación de Vehículos a RD",
  description:
    "Valcron te ayuda a gestionar la búsqueda, compra, transporte, exportación y llegada de un vehículo desde Estados Unidos hasta República Dominicana.",
  path: "/importacion",
});

const PHASES = [
  {
    step: "01",
    title: "Búsqueda",
    copy: "Identificamos la unidad según lo que buscas, en inventario o mediante subasta.",
  },
  {
    step: "02",
    title: "Compra",
    copy: "Organizamos la información de compra y los costos asociados antes de avanzar.",
  },
  {
    step: "03",
    title: "Transporte y exportación",
    copy: "Traslado terrestre, booking marítimo y salida hacia República Dominicana.",
  },
  {
    step: "04",
    title: "Llegada y entrega",
    copy: "Llegada, contexto de importación y coordinación de entrega. Los impuestos varían y se confirman al momento del despacho.",
  },
];

export default function ImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Importación"
        title="De Estados Unidos a República Dominicana"
        subtitle="Búsqueda, compra, transporte, exportación y coordinación de llegada. Sin cifras fijas que puedan cambiar."
        image={PAGE_HERO_IMAGES.importacion}
        imageAlt={PAGE_HERO_ALTS.importacion}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
          <p className="kicker">Proceso</p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold tracking-tight text-[#0b0c0e] md:text-4xl">
            Cómo llega un vehículo a RD
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5c5c5c]">
            Esta página cubre el traslado. La búsqueda en subastas está en{" "}
            <Link href="/subastas" className="font-medium text-[#0b0c0e] underline underline-offset-4">
              Subastas
            </Link>
            .
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {PHASES.map((phase) => (
              <article key={phase.step} className="rounded-2xl border border-[#e4e6ea] bg-[#f7f5f1] p-5">
                <p className="text-xs font-medium text-[#2b6cff]">{phase.step}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[#0b0c0e]">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5c5c5c]">{phase.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0c0e]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.85fr_1.15fr] md:px-8 md:py-16">
          <div>
            <p className="kicker text-[#2B6CFF]">Estimación</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Calcula partidas de referencia
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              El resultado es ilustrativo y no sustituye una cotización. WhatsApp {SITE.whatsapp}.
            </p>
            <Link href="/calculadoras/importacion" className="btn-secondary mt-6 inline-flex h-12 border-white/40 text-white">
              Abrir calculadora
            </Link>
          </div>
          <div className="hidden md:block">
            <ImportCostCalculator />
          </div>
        </div>
      </section>
    </main>
  );
}
