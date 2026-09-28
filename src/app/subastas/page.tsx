import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Vehículos de Subasta e Importación",
  description:
    "Valcron puede ayudarte a localizar vehículos disponibles mediante subastas en Estados Unidos y gestionar el proceso. Copart e IAA son plataformas, no socios.",
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
  { step: "01", title: "Dinos qué buscas", copy: "Marca, modelo, año y presupuesto." },
  { step: "02", title: "Revisamos opciones", copy: "Inventario y fuentes adecuadas." },
  { step: "03", title: "Cotizamos", copy: "Costos y escenarios claros." },
  { step: "04", title: "Seleccionas", copy: "Eliges la unidad que te conviene." },
  { step: "05", title: "Gestionamos el proceso contratado", copy: "Te acompañamos hasta el cierre." },
];

export default function SubastasPage() {
  return (
    <main>
      <PageHero
        kicker="Subastas"
        title="Más opciones. Más formas de encontrar tu vehículo."
        subtitle="Valcron puede asistirte con vehículos disponibles mediante plataformas como Copart e IAA. Son plataformas, no socios."
        image={PAGE_HERO_IMAGES.subastas}
        imageAlt={PAGE_HERO_ALTS.subastas}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="kicker">Fuentes de mercado</p>
            <h2 className="display-section mt-3 text-[#08090b]">
              Copart e IAA, como plataformas.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#676a70]">
              {SITE.shortName} te ayuda a explorar vehículos publicados en Copart e IAA. No operamos
              como socio, partner, representante autorizado ni afiliado de esas compañías.
            </p>
          </div>
          <div className="mt-12 grid gap-0 border-t border-[#e4e6ea] md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article
                key={item.name}
                className="border-b border-[#e4e6ea] py-8 md:border-r md:px-8 md:odd:pl-0 md:even:border-r-0 md:even:pr-0"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#2b6cff]">
                  Plataforma
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-[#08090b]">{item.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#676a70]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark bg-[#08090b]">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
          <p className="kicker text-[#2b6cff]">Proceso</p>
          <h2 className="display-section mt-3 text-white">De la búsqueda a la gestión</h2>
          <ol className="mt-12 max-w-3xl space-y-0">
            {STEPS.map((item) => (
              <li
                key={item.step}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/10 py-5"
              >
                <span className="font-display text-sm font-semibold tracking-[0.14em] text-[#2b6cff]">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <Link href="/inventario?listing=auction" className="btn-secondary">
              Explorar subastas
            </Link>
            <a
              href={whatsappHref(
                "Hola, quiero solicitar una búsqueda de vehículo en subastas de Estados Unidos.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
