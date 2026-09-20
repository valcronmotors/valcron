import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: `Cómo funciona ${SITE.shortName}: del primer mensaje a tu próximo vehículo en República Dominicana.`,
};

const STEPS = [
  { step: "01", title: "Cuéntanos qué buscas" },
  { step: "02", title: "Exploramos opciones" },
  { step: "03", title: "Revisamos información y costos" },
  { step: "04", title: "Tú decides" },
  { step: "05", title: "Coordinamos el proceso" },
  { step: "06", title: "Entrega" },
];

export default function ComoFuncionaPage() {
  return (
    <main>
      <PageHero
        kicker="Proceso"
        title="Cómo funciona Valcron Motors"
        subtitle="Del primer mensaje a tu próximo vehículo, con información clara en cada etapa."
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <p className="kicker">Pasos</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            Un proceso ordenado, sin promesas vacías
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {STEPS.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.15rem] border border-black/10 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.04)]"
              >
                <p className="kicker">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#111]">{item.title}</h3>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
            <Link href="/contacto" className="btn-secondary">
              Solicitar vehículo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
