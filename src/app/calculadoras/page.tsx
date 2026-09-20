import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadoras",
  description: `Herramientas de ${SITE.shortName} para planificar financiamiento, importación y subastas. Las cifras son estimaciones.`,
};

const CARDS = [
  {
    href: "/financiamiento",
    title: "Financiamiento",
    copy: "Simula inicial, plazo y cuota estimada.",
  },
  {
    href: "/importacion",
    title: "Importación",
    copy: "Revisa el proceso y las partidas de un costo estimado de llegada.",
  },
  {
    href: "/subastas",
    title: "Subasta USA",
    copy: "Prepara una búsqueda y una estimación antes de decidir.",
  },
];

export default function CalculadorasPage() {
  return (
    <main>
      <PageHero
        kicker="Herramientas"
        title="Herramientas para planificar tu compra."
        subtitle="Estimaciones para decidir con más contexto. No son cálculos oficiales ni aprobaciones."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-3 lg:px-8">
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="gloss-panel p-8 transition hover:-translate-y-1">
            <h2 className="font-display text-2xl font-semibold text-white">{card.title}</h2>
            <p className="mt-3 text-sm text-white/55">{card.copy}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
