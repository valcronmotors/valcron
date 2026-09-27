import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Subastas de vehículos en Estados Unidos",
  description:
    "Valcron Motors puede ayudarte a localizar y gestionar vehículos elegibles en plataformas de subasta como Copart e IAA.",
  path: "/subastas",
});

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Plataforma de subastas donde se publican vehículos de distintas condiciones. La usamos como fuente de mercado, no como socio oficial.",
  },
  {
    name: "IAA",
    copy: "Otra plataforma de subastas con publicaciones, fotos y datos de lote. Revisamos la información disponible antes de avanzar.",
  },
];

const STEPS = [
  { step: "01", title: "Defines marca, modelo y presupuesto" },
  { step: "02", title: "Localizamos opciones elegibles" },
  { step: "03", title: "Revisas y cotizas" },
  { step: "04", title: "Valcron gestiona el proceso" },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas USA"
        title="Oportunidades en subastas de Estados Unidos"
        subtitle="Valcron puede ayudarte a localizar y gestionar vehículos elegibles publicados en plataformas como Copart e IAA."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="kicker">Fuentes de mercado</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#141414] sm:text-4xl">
              Copart e IAA, como plataformas.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#5c5c5c] sm:text-base">
              {SITE.shortName} te ayuda a explorar vehículos publicados en Copart e IAA. No operamos
              como socio, partner, representante autorizado ni afiliado de esas compañías.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article key={item.name} className="rounded-2xl border border-[#e6e2db] bg-[#f7f5f1] p-7">
                <p className="kicker">Plataforma</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-[#141414]">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5c5c]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#141414]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="kicker text-[#C7A96B]">Proceso</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            De la búsqueda a la gestión
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((item) => (
              <article key={item.step} className="rounded-xl border border-white/10 p-6">
                <p className="kicker text-[#C7A96B]">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{item.title}</h3>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref("Hola, quiero solicitar una búsqueda de vehículo en subastas de Estados Unidos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <Link href="/inventario?listing=auction" className="btn-secondary">
              Explorar oportunidades
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
