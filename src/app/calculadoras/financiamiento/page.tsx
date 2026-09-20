import { FinanceForm } from "@/components/public/FinanceForm";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = publicPageMetadata({
  title: "Calculadora de financiamiento",
  description: `Estima una cuota ilustrativa de financiamiento con ${SITE.shortName}. No es una aprobación.`,
  path: "/calculadoras/financiamiento",
});

export default function CalculadoraFinanciamientoPage() {
  return (
    <main>
      <PageHero
        kicker="Calculadoras"
        title="Financiamiento"
        subtitle="Simula inicial, plazo y cuota estimada. El resultado es ilustrativo."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="kicker">Estimación</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
              Calcula escenarios antes de solicitar información
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#d4d4d4]">
              Las cifras son una referencia. La pre-evaluación definitiva corresponde a cada
              institución según historial y documentación.
            </p>
          </div>
          <Suspense fallback={<div className="gloss-panel p-8 text-sm text-[#d4d4d4]">Cargando simulador...</div>}>
            <FinanceForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
