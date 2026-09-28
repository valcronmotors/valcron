import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Calculadoras de importación y financiamiento",
  description: `Estimaciones de ${SITE.shortName} para financiamiento, importación y subastas. No son cifras oficiales.`,
  path: "/calculadoras",
});

const CARDS = [
  {
    href: "/calculadoras/financiamiento",
    title: "Financiamiento",
    copy: "Inicial, plazo y cuota estimada.",
  },
  {
    href: "/calculadoras/importacion",
    title: "Importación",
    copy: "Partidas de referencia para una llegada estimada.",
  },
  {
    href: "/calculadoras/subasta",
    title: "Subasta USA",
    copy: "Contexto antes de solicitar una búsqueda.",
  },
];

export default function CalculadorasPage() {
  return (
    <main>
      <PageHero
        kicker="Herramientas"
        title="Planifica con números de referencia"
        subtitle="Simulaciones para comparar escenarios. No sustituyen cotización ni aprobación bancaria."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />
      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer>
          <SectionHeader
            kicker="Calculadoras"
            title="Elige una herramienta"
            subtitle="Los resultados son ilustrativos y pueden cambiar según tu caso."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col border border-[#e4e6ea] bg-white p-6 transition-colors duration-180 hover:border-[#08090b]/20 md:p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#08090b]">
                  {card.title}
                </h2>
                <p className="mt-3 flex-1 text-base text-[#676a70]">{card.copy}</p>
                <span className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#08090b] px-4 text-sm font-semibold text-white transition-colors group-hover:bg-[#12141a]">
                  Abrir
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
