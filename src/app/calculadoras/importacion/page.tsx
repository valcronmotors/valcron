import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Calculadora de importación",
  description: `Estima partidas ilustrativas de importación con ${SITE.shortName}. No es un cálculo oficial.`,
  path: "/calculadoras/importacion",
});

export default function CalculadoraImportacionPage() {
  return (
    <main>
      <PageHero
        kicker="Calculadoras"
        title="Importación"
        subtitle="Revisa las partidas principales de un costo estimado de llegada. Las cifras son ilustrativas."
        image={PAGE_HERO_IMAGES.importacion}
        imageAlt={PAGE_HERO_ALTS.importacion}
      />
      <section className="section-light bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-16">
          <div>
            <p className="kicker">Estimación</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#0b0c0e] md:text-4xl">
              Organiza los costos antes de comprar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5c5c5c]">
              El resultado no sustituye una cotización formal ni la liquidación aduanal.
            </p>
          </div>
          <ImportCostCalculator />
        </div>
      </section>
    </main>
  );
}
