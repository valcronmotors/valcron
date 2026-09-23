import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";
import { auctionFeeConfig } from "@/lib/auction-fee-config";

export const metadata = publicPageMetadata({
  title: "Subastas de vehículos en Estados Unidos",
  description:
    "Explora oportunidades de vehículos en plataformas de subastas de Estados Unidos y conoce cómo funciona el proceso de compra con Valcron Motors.",
  path: "/subastas",
});

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Plataforma de subastas donde se publican vehículos de distintas condiciones. La usamos para identificar oportunidades, no como socio oficial.",
  },
  {
    name: "IAAI",
    copy: "Otra plataforma de subastas con publicaciones, fotos y datos de lote. Revisamos la información disponible antes de avanzar.",
  },
  {
    name: "Manheim",
    copy: "Canal de subasta más cercano al mercado dealer. Localizamos unidades de interés según presupuesto y condición.",
  },
];

const TERMS = [
  {
    title: "Lote",
    copy: "Identificador de la publicación. Ahí se concentran fotos, ubicación y datos de la unidad.",
  },
  {
    title: "Título",
    copy: "Clean, Salvage, Rebuilt u otras marcas no son intercambiables. El tipo de título condiciona expectativas.",
  },
  {
    title: "Daños reportados",
    copy: "La plataforma describe daños primarios y secundarios. Es una referencia, no un diagnóstico completo.",
  },
  {
    title: "Run & Drive",
    copy: "Indica que el vehículo arranca y se desplaza en el momento de la inspección. No sustituye una revisión mecánica.",
  },
  {
    title: "Pre-bid y live",
    copy: "Puedes ofertar antes o durante el evento. El precio cambia según la competencia de esa subasta.",
  },
  {
    title: "Buy It Now",
    copy: "Algunas unidades ofrecen un precio fijo para compra inmediata, cuando la plataforma lo habilita.",
  },
];

const STEPS = [
  { step: "01", title: "Defines marca, modelo y presupuesto" },
  { step: "02", title: "Localizamos opciones en subastas" },
  { step: "03", title: "Revisamos lote, título, daños y costos" },
  { step: "04", title: "Tú decides si avanzas con la compra" },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas USA"
        title="Explora oportunidades de vehículos en subastas de Estados Unidos"
        subtitle="Conoce cómo funciona el proceso de compra en plataformas de subastas y evalúa unidades con más contexto antes de decidir."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="kicker">Plataformas</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
              Copart, IAAI y Manheim, como plataformas.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#d4d4d4]">
              {SITE.shortName} puede ayudarte a explorar vehículos publicados en{" "}
              {auctionFeeConfig.platforms.join(", ")}. No operamos como socio oficial, partner,
              representante autorizado ni afiliado de estas compañías.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLATFORMS.map((item) => (
              <article key={item.name} className="gloss-panel p-7">
                <p className="kicker">Plataforma</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#d4d4d4]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <p className="kicker">Cómo funcionan</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111]">
            Información del lote, evaluación y compra.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TERMS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.15rem] border border-black/10 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.04)]"
              >
                <h3 className="font-display text-xl font-semibold text-[#111]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#525252]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <p className="kicker">Proceso de compra</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
            De la búsqueda a la decisión
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((item) => (
              <article key={item.step} className="gloss-panel p-6">
                <p className="kicker">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{item.title}</h3>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-[#d4d4d4]">
            Si la unidad se compra fuera de República Dominicana, el siguiente paso es el proceso de
            importación. Ese detalle vive en su propia página.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref(
                "Hola, quiero solicitar una búsqueda de vehículo en subastas de Estados Unidos.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Solicitar búsqueda
            </a>
            <Link href="/calculadoras/subasta" className="btn-secondary">
              Calcular subasta
            </Link>
            <Link href="/importacion" className="text-sm font-semibold text-white underline-offset-4 hover:underline">
              Siguiente paso: importación
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
