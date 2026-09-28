import Link from "next/link";
import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Importación de vehículos a República Dominicana",
  description:
    "Orientación clara sobre selección, compra, transporte e importación de vehículos a RD. Sin montos de impuestos garantizados. Valcron Motors.",
  path: "/importacion",
});

const PHASES = [
  {
    step: "01",
    title: "Selección",
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
    title: "Importación y entrega",
    copy: "Llegada, contexto de importación y coordinación de entrega. Los impuestos se confirman al despacho.",
  },
];

export default function ImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Importación"
        title="Cuando el vehículo viene de fuera"
        subtitle="Selección, compra, transporte y coordinación de llegada. Sin cifras fijas que puedan cambiar."
        image={PAGE_HERO_IMAGES.importacion}
        imageAlt={PAGE_HERO_ALTS.importacion}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="kicker">Proceso</p>
          <h2 className="display-section mt-3 max-w-2xl text-[#08090b]">
            Lo esencial, sin tecnicismos.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#676a70]">
            La búsqueda en subastas está en{" "}
            <Link href="/subastas" className="font-medium text-[#08090b] underline underline-offset-4">
              Subastas
            </Link>
            . Aquí cubrimos el traslado a República Dominicana.
          </p>
          <ol className="mt-10 max-w-3xl space-y-0">
            {PHASES.map((phase) => (
              <li
                key={phase.step}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-[#e4e6ea] py-5"
              >
                <span className="font-display text-sm font-semibold tracking-[0.14em] text-[#2b6cff]">
                  {phase.step}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#08090b]">{phase.title}</h3>
                  <p className="mt-1 text-sm text-[#676a70]">{phase.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-dark bg-[#08090b]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[0.85fr_1.15fr] md:px-8 md:py-20">
          <div>
            <p className="kicker text-[#2b6cff]">Estimación</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Calcula partidas de referencia
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              El resultado es ilustrativo y no sustituye una cotización. WhatsApp {SITE.whatsapp}.
            </p>
            <Link
              href="/calculadoras/importacion"
              className="btn-secondary mt-6 inline-flex h-12 border-white/40 text-white"
            >
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
