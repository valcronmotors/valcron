import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const STEPS = [
  { step: "01", title: "Búsqueda" },
  { step: "02", title: "Cotización" },
  { step: "03", title: "Compra" },
  { step: "04", title: "Transporte" },
  { step: "05", title: "Embarque" },
  { step: "06", title: "Importación" },
  { step: "07", title: "Entrega" },
];

export function HomeImport() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.carrier.src}
        alt={EDITORIAL.carrier.alt}
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="kicker text-white/55">EE.UU. → República Dominicana</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Tu vehículo.
          <span className="block">Nosotros te ayudamos a mover el proceso.</span>
        </h2>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {STEPS.map((item) => (
            <article key={item.step} className="rounded-2xl border border-white/12 bg-black/40 p-4 backdrop-blur-md">
              <p className="kicker text-white/40">{item.step}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">{item.title}</h3>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/importacion" className="btn-primary">
            Cómo funciona la importación
          </Link>
          <Link href="/calculadoras" className="btn-secondary">
            Calcular importación
          </Link>
        </div>
      </div>
    </section>
  );
}
