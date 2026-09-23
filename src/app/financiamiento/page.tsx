import { FinanceForm } from "@/components/public/FinanceForm";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = publicPageMetadata({
  title: "Financiamiento de vehículos en RD",
  description:
    "Explora escenarios de compra y opciones de financiamiento disponibles a través de bancos locales. La aprobación y las condiciones las define cada institución financiera.",
  path: "/financiamiento",
});

const REQUIREMENTS = [
  {
    title: "Persona física asalariada",
    items: [
      "Cédula de identidad y electoral",
      "Carta de trabajo y últimos comprobantes de ingresos",
      "Estados de cuenta o evidencia de capacidad de pago",
      "Referencias y buró crediticio según política de cada banco",
    ],
  },
  {
    title: "Independientes / formalizados",
    items: [
      "Cédula y RNC o evidencia de actividad económica",
      "Declaraciones o estados financieros recientes",
      "Estados de cuenta de los últimos meses",
      "Documentación del vehículo a financiar",
    ],
  },
];

export default function FinanciamientoPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Financiamiento"
          title="Bancos locales, proceso ordenado"
          subtitle="Explora escenarios de compra y opciones de financiamiento disponibles a través de bancos locales, sujeto a evaluación y condiciones de cada institución."
          image={PAGE_HERO_IMAGES.financiamiento}
          imageAlt={PAGE_HERO_ALTS.financiamiento}
        />

        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="kicker">Bancos locales</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Financiamiento con bancos locales
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#d4d4d4]">
                {SITE.shortName} te ayuda a organizar la información de tu compra. No somos un
                banco. Las opciones, tasas, requisitos y aprobaciones dependen de cada institución
                financiera y del perfil del solicitante.
              </p>
            </div>
          </div>
        </section>

        <section className="section-light bg-[#faf9f6]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8">
            {REQUIREMENTS.map((group) => (
              <article key={group.title} className="rounded-[1.15rem] border border-black/10 bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
                <h3 className="font-display text-2xl font-semibold text-[#111]">{group.title}</h3>
                <ul className="mt-6 grid gap-3 text-sm leading-relaxed text-[#404040]">
                  {group.items.map((item) => (
                    <li key={item} className="border-l-2 border-[#C7A96B] pl-4">
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
              <p className="kicker">Simulador</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                Calcula escenarios de compra
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Ingresa precio, inicial, tasa y plazo. La cuota es ilustrativa. La aprobación
                definitiva la define cada banco local. WhatsApp {SITE.whatsapp}.
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
