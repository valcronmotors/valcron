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
    "Orientación para financiar con bancos en RD. Valcron no es banco; la aprobación la define cada institución.",
  path: "/financiamiento",
});

const REQUIREMENTS = [
  {
    title: "Asalariado",
    items: ["Cédula y carta de trabajo", "Comprobantes de ingreso", "Referencias según el banco"],
  },
  {
    title: "Independiente",
    items: ["Cédula y actividad económica", "Estados de cuenta recientes", "Datos del vehículo a financiar"],
  },
];

export default function FinanciamientoPage() {
  return (
    <main>
      <PageHero
        kicker="Financiamiento"
        title="Orientación con bancos locales"
        subtitle="Te ayudamos a ordenar tu caso. No prometemos aprobación ni somos prestamista."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />

      <Section className="section-light bg-white">
        <PageContainer>
          <SectionHeader
            kicker="Cómo funciona"
            title="Información ordenada, sin atajos"
            subtitle={`${SITE.shortName} prepara tu compra ante bancos locales. Inicial, plazo, tasa y aprobación dependen de cada institución.`}
          />
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f7f8fa]" tight>
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
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2b6cff]"
                        aria-hidden
                      />
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
                title="Calcula escenarios"
                subtitle="Cuota ilustrativa. La aprobación la define cada banco."
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
                  <div className="border border-white/10 bg-[#12141a] p-8 text-sm text-white/70">
                    Cargando simulador...
                  </div>
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
