import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subastas internacionales",
  description:
    "Valcron Motors ayuda a buscar y gestionar vehículos en plataformas de subastas de Estados Unidos, como Copart, IAAI y Manheim, con importación a República Dominicana.",
};

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Buscamos oportunidades en esta plataforma según presupuesto, marca y condición.",
  },
  {
    name: "IAAI",
    copy: "Revisamos opciones disponibles y te orientamos antes de avanzar con una compra.",
  },
  {
    name: "Manheim",
    copy: "Localizamos unidades de interés y te acompañamos en la evaluación del proceso.",
  },
];

const STEPS = [
  { step: "01", title: "Defines marca, modelo y presupuesto" },
  { step: "02", title: "Localizamos opciones en subastas" },
  { step: "03", title: "Revisamos costos y viabilidad" },
  { step: "04", title: "Gestionamos compra e importación a RD" },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas internacionales"
        title="Más opciones. Más oportunidades."
        subtitle="Valcron Motors ayuda al cliente a buscar y gestionar vehículos provenientes de plataformas de subastas, con un proceso de importación hacia República Dominicana."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="kicker">Plataformas</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
              Buscamos oportunidades en plataformas como Copart, IAAI y Manheim.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/58">
              {SITE.shortName} no opera como socio oficial, partner, representante autorizado ni
              afiliado de estas compañías. Nuestro rol es ayudarte a identificar opciones y
              gestionar el proceso de compra e importación.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLATFORMS.map((item) => (
              <article key={item.name} className="gloss-panel p-7">
                <p className="kicker">Plataforma</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <p className="kicker">Proceso</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
            De la búsqueda a la importación
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((item) => (
              <article key={item.step} className="gloss-panel p-6">
                <p className="kicker">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{item.title}</h3>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={whatsappHref(
                "Hola, quiero solicitar una búsqueda de vehículo en subastas de Estados Unidos.",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Solicitar búsqueda
            </a>
            <Link href="/importacion" className="btn-secondary">
              Ver proceso de importación
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
