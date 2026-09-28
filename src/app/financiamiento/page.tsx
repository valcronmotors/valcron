import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FinanceForm } from "@/components/public/FinanceForm";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { VisualCaption } from "@/components/public/VisualStory";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Financiamiento de vehículos con bancos locales",
  description:
    "Orientación para financiar con bancos en RD. Valcron no es banco; la aprobación la define cada institución.",
  path: "/financiamiento",
});

const FINANCE_STEPS = [
  {
    step: "01",
    title: "Elige tu vehículo",
    copy: "Inventario publicado o búsqueda a tu medida.",
    image: EDITORIAL.compactSuv,
  },
  {
    step: "02",
    title: "Define tu inicial",
    copy: "Ordenamos el escenario antes de hablar con el banco.",
    image: EDITORIAL.processQuote,
  },
  {
    step: "03",
    title: "Evalúa opciones",
    copy: "Plazo y cuota ilustrativa — sin tasas garantizadas.",
    image: EDITORIAL.processFinance,
  },
  {
    step: "04",
    title: "Completa el proceso",
    copy: "Con la institución financiera. La aprobación la define ella.",
    image: EDITORIAL.cityDrive,
  },
] as const;

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
            title="Cuatro pasos visuales"
            subtitle={`${SITE.shortName} prepara tu compra ante bancos locales. Inicial, plazo, tasa y aprobación dependen de cada institución.`}
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FINANCE_STEPS.map((item) => (
              <li
                key={item.step}
                className="overflow-hidden border border-[#e4e6ea] bg-[#f7f8fa]"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <div className="relative aspect-[16/11] bg-[#eef0f3]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 25vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
                    {item.step}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#08090b]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <VisualCaption>Orientación para financiamiento · sin aprobaciones ficticias</VisualCaption>
          </div>
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
