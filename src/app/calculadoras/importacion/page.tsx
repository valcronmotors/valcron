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
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="kicker">Landing cost</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
              Organiza los costos antes de pujar
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#d4d4d4]">
              El resultado no sustituye una cotización formal ni la liquidación aduanal.
            </p>
          </div>
          <ImportCostCalculator />
        </div>
      </section>
    </main>
  );
}
