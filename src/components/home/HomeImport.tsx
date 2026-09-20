import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const STEPS = [
  { step: "01", title: "Búsqueda" },
  { step: "02", title: "Evaluación" },
  { step: "03", title: "Compra" },
  { step: "04", title: "Transporte terrestre" },
  { step: "05", title: "Puerto / exportación" },
  { step: "06", title: "Transporte marítimo" },
  { step: "07", title: "Proceso en RD" },
  { step: "08", title: "Entrega" },
];

export function HomeImport() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.carrier.src}
        alt={EDITORIAL.carrier.alt}
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/82 to-black/42" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Importación</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          De Estados Unidos
          <span className="block">a República Dominicana.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4d4d4]">
          Importar un vehículo implica mucho más que comprarlo. Nuestro objetivo es ayudarte a
          comprender y organizar cada etapa del proceso.
        </p>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <article key={item.step} className="rounded-2xl border border-white/12 bg-black/40 p-4 backdrop-blur-md">
              <p className="kicker">{item.step}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">{item.title}</h3>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/importacion" className="btn-primary">
            Conocer el proceso
          </Link>
          <Link href="/calculadoras" className="btn-secondary">
            Calcular importación
          </Link>
        </div>
      </div>
    </section>
  );
}
