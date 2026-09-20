import { FinanceForm } from "@/components/public/FinanceForm";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Financiamiento Bancario",
  description:
    "Opciones de financiamiento con banca local de República Dominicana y pre-evaluación de Valcron Motors Group.",
};

const BANKS = ["Banreservas", "Banco Popular", "BHD", "Scotiabank", "Banco BDI"];

const REQUIREMENTS = [
  {
    title: "Persona física asalariada",
    items: [
      "Cédula de identidad y electoral",
      "Carta de trabajo y últimos comprobantes de ingresos",
      "Estados de cuenta o evidencia de capacidad de pago",
      "Referencias y buró crediticio según política del banco",
    ],
  },
  {
    title: "Independientes / formalizados",
    items: [
      "Cédula y RNC o evidencia de actividad económica",
      "Declaraciones o estados financieros recientes",
      "Estados de cuenta de los últimos meses",
      "Documentación del vehículo a financiar o a importar",
    ],
  },
];

export default function FinanciamientoPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Financiamiento"
          title="Banca local, proceso ordenado"
          subtitle="Estructuramos pre-evaluaciones con Banreservas, Banco Popular, BHD y otras instituciones para stock en RD o unidades importadas a tu nombre."
          image={PAGE_HERO_IMAGES.financiamiento}
          imageAlt={PAGE_HERO_ALTS.financiamiento}
        />

        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="kicker">Aliados</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Opciones con la banca de República Dominicana
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {SITE.shortName} prepara el expediente y te acompaña en la pre-evaluación. La
                aprobación final corresponde a cada banco según historial, inicial y capacidad de
                pago.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {BANKS.map((bank) => (
                <article
                  key={bank}
                  className="gloss-panel px-5 py-6 text-center"
                >
                  <p className="text-sm font-medium tracking-wide text-foreground">{bank}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8">
            {REQUIREMENTS.map((group) => (
              <article key={group.title} className="gloss-panel p-8">
                <h3 className="font-display text-2xl font-semibold text-foreground">{group.title}</h3>
                <ul className="mt-6 grid gap-3 text-sm leading-relaxed text-muted">
                  {group.items.map((item) => (
                    <li key={item} className="border-l border-accent pl-4 text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="kicker">
                Pre-aprobación
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                Simula y envía tu solicitud
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Ingresa monto, inicial y plazo. La cuota es ilustrativa. Enviamos la
                pre-evaluación al WhatsApp {SITE.whatsapp}.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="gloss-panel p-8 text-sm text-muted">
                  Cargando simulador...
                </div>
              }
            >
              <FinanceForm />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
