import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Importación Directa",
  description:
    "Importación por encargo desde Copart y Manheim: asesoría, puja, transporte marítimo con seguro y despacho aduanal en República Dominicana.",
};

const PHASES = [
  {
    step: "01",
    title: "Asesoría y Selección",
    copy: "Definimos presupuesto, condición, historial y si la unidad puede calificar a Ley 103-13. Te presentamos opciones reales en Copart y Manheim antes de pujar.",
  },
  {
    step: "02",
    title: "Puja e Inspección",
    copy: "Operamos con licencia de dealer. Pujamos con techo acordado, revisamos título, daños reportados e inspección cuando aplica, y confirmamos la compra.",
  },
  {
    step: "03",
    title: "Transporte Marítimo con Seguro",
    copy: "Inland hasta puerto, booking marítimo y cobertura de seguro de carga. Recibes un expediente con fechas, costos y tracking hasta República Dominicana.",
  },
  {
    step: "04",
    title: "Despacho Aduanal en RD",
    copy: "Gestión ante DGA, impuestos, exoneraciones aplicables, nacionalización y entrega en Santo Domingo Este con diagnóstico técnico de recepción.",
  },
];

export default function ImportacionPage() {
  return (
    <>
      <main>
        <PageHero
          kicker="Importación Directa"
          title="Por encargo desde Copart y Manheim"
          subtitle="Traemos a tu nombre la unidad que buscas, con un expediente transparente de costos, tiempos y despacho en República Dominicana."
          image={PAGE_HERO_IMAGES.importacion}
          imageAlt={PAGE_HERO_ALTS.importacion}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="kicker">El servicio</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Importación con control de principio a fin
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {SITE.shortName} selecciona, puja e importa desde subastas de Estados Unidos. No
                improvisamos costos: cada partida —vehículo, inland, flete, seguro, aduana y
                honorarios— queda documentada antes de avanzar.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {PHASES.map((phase) => (
                <article
                  key={phase.step}
                  className="rounded-2xl border border-line bg-surface p-8"
                >
                  <p className="kicker">
                    Fase {phase.step}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{phase.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <p className="kicker">Ley 103-13</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Exoneraciones para híbridos y eléctricos
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                La Ley 103-13 establece incentivos fiscales para vehículos de energías no
                convencionales. Evaluamos si la unidad califica, preparamos el expediente y
                coordinamos el tratamiento aduanal antes de pujar, para que el ahorro no sea una
                sorpresa a destiempo.
              </p>
              <ul className="mt-8 grid gap-3 text-sm leading-relaxed text-foreground">
                <li className="border-l border-accent pl-4">
                  Revisión de idoneidad: híbridos, plug-in y 100% eléctricos.
                </li>
                <li className="border-l border-accent pl-4">
                  Estimación de impuestos e incentivos antes de la puja.
                </li>
                <li className="border-l border-accent pl-4">
                  Documentación para DGA y nacionalización en República Dominicana.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <p className="text-sm leading-relaxed text-muted">
                El incentivo depende de la normativa vigente, el tipo de propulsión y el
                expediente de la unidad. Te entregamos una lectura clara: qué aplica, qué no, y
                cómo se refleja en el costo total de importación.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="kicker">Calculadora</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                Estima el costo de traer tu unidad
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Ajusta subasta, flete, DGA y puerto en tiempo real. El resultado es ilustrativo y
                se envía al WhatsApp {SITE.whatsapp} para abrir el expediente.
              </p>
            </div>
            <ImportCostCalculator />
          </div>
        </section>
      </main>
    </>
  );
}
