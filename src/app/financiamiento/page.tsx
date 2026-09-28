import Link from "next/link";
import { Suspense } from "react";
import { FinanceForm } from "@/components/public/FinanceForm";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Financiamiento de vehículos con bancos locales",
  description:
    "Orientación de financiamiento con bancos locales en República Dominicana. Calcula escenarios. La aprobación la define cada banco.",
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
    <main>
      <PageHero
        kicker="Financiamiento"
        title="Financiamiento con bancos locales"
        subtitle="Te orientamos a organizar tu caso. No prometemos aprobación. Las condiciones las define cada institución financiera."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <SectionHeader
            kicker="Cómo funciona"
            title="Un proceso ordenado, sin atajos."
            subtitle={`${SITE.shortName} te ayuda a preparar la información de tu compra. No somos un banco. Inicial, plazo, tasa y aprobación dependen de cada institución y de tu perfil.`}
          />
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f5f6f7]" tight>
        <PageContainer>
          <div className="grid gap-4 md:grid-cols-2">
            {REQUIREMENTS.map((group) => (
              <article
                key={group.title}
                className="border border-[#e4e6ea] bg-white p-6 md:p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <h3 className="font-display text-xl font-semibold text-[#08090b] md:text-2xl">
                  {group.title}
                </h3>
                <ul className="mt-5 grid gap-3 text-base text-[#676a70]">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2b6cff]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </PageContainer>
      </Section>

      <Section className="section-dark bg-[#08090b]">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
            <div>
              <SectionHeader
                kicker="Simulador"
                title="Calcula escenarios de compra"
                subtitle="Ingresa precio, inicial, tasa y plazo. La cuota es ilustrativa. La aprobación definitiva la define cada banco local."
                tone="dark"
              />
              <Link
                href="/calculadoras/financiamiento"
                className="btn-secondary mt-8 inline-flex border-white/35 text-white md:hidden"
              >
                Abrir calculadora
              </Link>
            </div>
            <div
              className="hidden overflow-hidden md:block"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <Suspense
                fallback={
                  <div className="gloss-panel p-8 text-sm text-white/70">Cargando simulador...</div>
                }
              >
                <FinanceForm />
              </Suspense>
            </div>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
