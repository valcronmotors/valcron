import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calculadora de subasta",
  description: `Prepara una búsqueda y una estimación antes de comprar en subasta con ${SITE.shortName}.`,
};

export default function CalculadoraSubastaPage() {
  return (
    <main>
      <PageHero
        kicker="Calculadoras"
        title="Subasta USA"
        subtitle="Prepara una búsqueda y una estimación antes de decidir. No es un cálculo oficial de fees."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
          <p className="kicker">Cómo usarla</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111]">
            Estima antes de pujar
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[#404040]">
            Los fees de plataforma, inland y flete varían según lote, ubicación y condición. Te
            ayudamos a revisar esas partidas caso por caso, sin tratar las plataformas como socios
            oficiales.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref(
                "Hola, quiero una estimación de costos para una unidad en subasta de Estados Unidos.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Solicitar estimación
            </a>
            <Link href="/subastas" className="btn-secondary">
              Ver proceso de subastas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
