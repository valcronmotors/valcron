import Image from "next/image";
import { PageHero } from "@/components/public/PageHero";
import { NOSOTROS_GALLERY_IMAGE, PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Historia, misión y compromiso de ${SITE.name} en República Dominicana.`,
};

const VALUES = [
  {
    title: "Transparencia",
    copy: "Cada partida de costo, título y tiempo de entrega se documenta. No hay letras pequeñas en el proceso.",
  },
  {
    title: "Calidad técnica",
    copy: "Diagnóstico de recepción, revisión de historial y criterio de dealer antes de ofrecer una unidad.",
  },
  {
    title: "Servicio de excelencia",
    copy: "Un mismo equipo acompaña desde la primera consulta hasta la entrega en Santo Domingo Este.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <main>
        <PageHero
          kicker={SITE.name}
          title="Sobre Valcron Motors Group"
          subtitle="Dealer en República Dominicana dedicado a vender, importar y financiar vehículos con un estándar de lujo sobrio: claridad, criterio técnico y entrega puntual."
          image={PAGE_HERO_IMAGES.nosotros}
          imageAlt={PAGE_HERO_ALTS.nosotros}
        />

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="kicker">Historia</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Filosofía de dealer
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {SITE.name} nace en Santo Domingo Este para profesionalizar la compra de
                vehículos: stock local, importación directa desde Copart y Manheim, y
                financiamiento con banca de primer nivel. Operamos como SRL con un estándar
                único: el cliente entiende cada decisión antes de firmar.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Nuestra oficina comercial en {SITE.address.full} es el punto de encuentro para
                asesoría, entrega y postventa. El inventario público refleja el mismo criterio
                que usamos internamente: unidades que podemos defender en calidad y papeles.
              </p>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line">
              <Image
                src={NOSOTROS_GALLERY_IMAGE}
                alt="Instalaciones y estándar visual de Valcron Motors Group"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <article className="rounded-2xl border border-line bg-white p-8 lg:col-span-1">
                <p className="kicker">Misión</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  Facilitar la adquisición de vehículos confiables en República Dominicana,
                  con transparencia de costos, calidad técnica y un servicio personalizado de
                  principio a fin.
                </p>
              </article>
              <article className="rounded-2xl border border-line bg-white p-8 lg:col-span-1">
                <p className="kicker">Visión</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  Ser el dealer de referencia en Santo Domingo Este para venta, importación y
                  financiamiento, reconocido por rigor, discreción y excelencia operativa.
                </p>
              </article>
              <article className="rounded-2xl border border-line bg-white p-8 lg:col-span-1">
                <p className="kicker">Equipo</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  Asesores comerciales, gestión de subastas y despacho aduanal en un mismo
                  flujo. Un interlocutor, un expediente, una entrega.
                </p>
              </article>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {VALUES.map((value) => (
                <article key={value.title} className="rounded-2xl border border-line bg-white p-8">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{value.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <p className="kicker">Garantía</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-foreground">
              Certificación en cada vehículo importado
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
              Toda unidad que entra por nuestro canal de importación se entrega con revisión
              de título, expediente de costos y diagnóstico técnico de recepción. El compromiso
              no es un eslogan: es el filtro que decide qué llega al inventario público.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
