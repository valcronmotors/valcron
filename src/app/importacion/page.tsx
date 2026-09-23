import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageHero } from "@/components/public/PageHero";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = publicPageMetadata({
  title: "Importación de vehículos a República Dominicana",
  description:
    "Proceso para trasladar y gestionar un vehículo desde Estados Unidos hasta República Dominicana: transporte, documentación, llegada y estimación de costos con Valcron Motors.",
  path: "/importacion",
});

const PHASES = [
  {
    step: "01",
    title: "Compra",
    copy: "Cuando ya hay una unidad identificada, organizamos la información de compra, costos asociados y el expediente para mover el vehículo.",
  },
  {
    step: "02",
    title: "Transporte",
    copy: "Traslado terrestre hasta puerto, booking marítimo y seguimiento de la carga hacia República Dominicana.",
  },
  {
    step: "03",
    title: "Importación",
    copy: "Documentación, llegada, contexto aduanal y los componentes de costo que conviene revisar antes de nacionalizar.",
  },
  {
    step: "04",
    title: "Entrega",
    copy: "Coordinación de recepción en República Dominicana y los pasos posteriores según el caso, incluida la primera inscripción cuando ya está soportada en el proceso.",
  },
];

export default function ImportacionPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Importación"
          title="De Estados Unidos a República Dominicana"
          subtitle="Conoce el proceso para trasladar y gestionar un vehículo desde Estados Unidos hasta República Dominicana, con una lectura clara de etapas y costos."
          image={PAGE_HERO_IMAGES.importacion}
          imageAlt={PAGE_HERO_ALTS.importacion}
        />

        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="kicker">Logística y proceso</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Transporte, documentos y llegada
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#d4d4d4]">
                Esta página explica el proceso de importación. La búsqueda de unidades en subastas
                está en{" "}
                <Link href="/subastas" className="text-white underline underline-offset-4 hover:text-[#C7A96B]">
                  Subastas USA
                </Link>
                . Aquí nos concentramos en mover y gestionar el vehículo hasta República Dominicana.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {PHASES.map((phase) => (
                <article key={phase.step} className="gloss-panel p-8">
                  <p className="kicker">Fase {phase.step}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">{phase.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#d4d4d4]">{phase.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-light bg-[#faf9f6]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <p className="kicker">Ley 103-13</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111] sm:text-5xl">
                Contexto educativo para híbridos y eléctricos
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#404040]">
                En República Dominicana existe la Ley 103-13, asociada a incentivos para el uso de
                energía no convencional. Los detalles de exenciones, porcentajes y vehículos que
                califican dependen de la norma vigente y de cómo la aplican las autoridades en el
                momento del despacho. No publicamos aquí un porcentaje ni una lista de marcas
                “exentas”.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#404040]">
                Si el incentivo forma parte de tu cuenta, confírmalo con la autoridad competente o
                con un profesional del despacho antes de comprar.
              </p>
              <Link
                href="/blog/vehiculos-hibridos-republica-dominicana"
                className="mt-8 inline-flex text-sm font-semibold text-[#111] underline-offset-4 hover:underline"
              >
                Leer más en el blog
              </Link>
            </div>
            <div className="relative min-h-[22rem] overflow-hidden rounded-[1.35rem] bg-[#111] lg:min-h-full">
              <EditorialImage
                src={EDITORIAL.hybridEv.src}
                alt={EDITORIAL.hybridEv.alt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C7A96B]">
                  Ley 103-13
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                  Contenido educativo
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#d4d4d4]">
                  La elegibilidad la confirma el proceso oficial, no una estimación del website.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="kicker">Calculadora</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
                Estima componentes de costo
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#d4d4d4]">
                Organiza partidas como vehículo, flete e impuestos de referencia. El resultado es
                ilustrativo y no sustituye una cotización oficial. WhatsApp {SITE.whatsapp}.
              </p>
            </div>
            <ImportCostCalculator />
          </div>
        </section>
      </main>
    </>
  );
}
