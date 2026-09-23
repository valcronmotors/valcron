import Image from "next/image";
import { BadgeCheck, Scale, ShieldCheck, Users, Eye, Compass } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { NOSOTROS_GALLERY_IMAGE, PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { publicPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Nosotros",
  description: `Conoce a ${SITE.legalName}: dealer en Santo Domingo Este para encontrar, evaluar y adquirir vehículos en República Dominicana.`,
  path: "/nosotros",
});

const PILLARS = [
  {
    title: "Misión",
    icon: Compass,
    copy: "Ayudar a encontrar, comprar y entregar vehículos en República Dominicana con información clara y un trato directo.",
  },
  {
    title: "Visión",
    icon: Eye,
    copy: "Ser un dealer de referencia en Santo Domingo Este por inventario entendible, asesoría clara y acompañamiento hasta la entrega.",
  },
  {
    title: "Equipo",
    icon: Users,
    copy: "Un mismo interlocutor coordina la consulta, la búsqueda, el expediente y la entrega. No prometemos un tamaño de plantilla ni una estructura que no podemos mostrar aquí.",
  },
];

const VALUES = [
  {
    title: "Transparencia",
    icon: Scale,
    copy: "Explicamos qué se conoce del vehículo, qué falta por confirmar y qué partidas intervienen en una importación o una compra local.",
  },
  {
    title: "Calidad técnica",
    icon: ShieldCheck,
    copy: "Revisamos la información disponible —fotos, título, historial y costos— antes de recomendar una unidad. Un listado no sustituye una inspección presencial.",
  },
  {
    title: "Excelencia de servicio",
    icon: BadgeCheck,
    copy: "Acompañamos desde la primera consulta hasta la entrega en Santo Domingo Este, con comunicación directa por oficina, WhatsApp o visita.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ])}
      />
      <main>
        <PageHero
          kicker={SITE.name}
          title="Sobre Valcron Motors Group"
          subtitle="Dealer en República Dominicana para vender, importar y orientar la compra de vehículos con un estándar sobrio: claridad, criterio técnico y trato directo."
          image={PAGE_HERO_IMAGES.nosotros}
          imageAlt={PAGE_HERO_ALTS.nosotros}
        />

        <section className="section-light bg-[#faf9f6]">
          <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] lg:items-center lg:gap-14 lg:px-8 lg:py-28">
            <div className="min-w-0">
              <p className="kicker">Historia</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111] sm:text-5xl">
                Filosofía de dealer
              </h2>
              <p className="mt-5 max-w-prose text-sm leading-relaxed text-[#404040] sm:text-base">
                {SITE.name} opera desde Santo Domingo Este para profesionalizar la compra de
                vehículos: inventario local, búsqueda en plataformas de subasta de Estados Unidos e
                importación a República Dominicana. Trabajamos como sociedad de responsabilidad
                limitada. El cliente debe entender cada decisión —unidad, papeles y costos— antes de
                comprometerse.
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#404040] sm:text-base">
                Nuestra oficina comercial está en {SITE.address.full}. Desde ahí coordinamos asesoría,
                seguimiento y entrega. El inventario público muestra unidades que podemos explicar
                con la información disponible, sin inflar historial, cifras de ventas ni alianzas que
                no existan.
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#404040] sm:text-base">
                Copart, IAA/IAAI y Manheim son fuentes o plataformas de mercado. No las presentamos
                como socias de Valcron Motors. El financiamiento, cuando aplica, lo evalúa cada
                institución; nosotros orientamos el expediente, no aprobamos crédito.
              </p>
            </div>
            <div className="relative min-h-[280px] w-full min-w-0 overflow-hidden rounded-2xl border border-[#ececea] sm:min-h-[360px] lg:min-h-[440px]">
              <Image
                src={NOSOTROS_GALLERY_IMAGE}
                alt="Imagen ilustrativa de un entorno automotriz contemporáneo"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#050608]">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[...PILLARS, ...VALUES].map((item) => (
                <article
                  key={item.title}
                  className="flex h-full min-w-0 flex-col rounded-[1.15rem] border border-white/10 bg-[#0D0E10] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#C7A96B]">
                    <item.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#D4D4D4]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-light bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
            <p className="kicker">Criterio</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#111]">
              Qué podemos defender de cada unidad
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#404040] sm:text-base">
              Toda unidad que publicamos debe poder explicarse con la información que realmente
              tenemos: título cuando está documentado, fotos, estado de listado y partidas de costo
              relevantes. Eso no es una certificación, un sello oficial ni una garantía genérica. Es
              el filtro para que el inventario público coincida con lo que podemos sostener en una
              conversación de compra.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
