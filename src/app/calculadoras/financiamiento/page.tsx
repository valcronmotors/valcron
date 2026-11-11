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
      <section className="section-light bg-white">
        <div className="mx-auto grid max-w-5xl min-w-0 gap-8 px-4 py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:px-8 md:py-16">
          <div>
            <p className="kicker">Estimación</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#0b0c0e] md:text-4xl">
              Tu inicial. Tu plazo. Tu cuota.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5c5c5c]">
              Simula en pesos y cotiza por WhatsApp. La aprobación corresponde al banco.
            </p>
          </div>
          <Suspense fallback={<div className="rounded-2xl bg-[#f5f6f7] p-8 text-sm text-[#50545b]">Cargando simulador...</div>}>
            <FinanceForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
