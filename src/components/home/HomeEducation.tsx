import Link from "next/link";

const GUIDES = [
  {
    href: "/blog/clean-title-salvage-rebuilt-diferencias",
    title: "¿Qué es Salvage Title?",
    copy: "Un título de Estados Unidos que indica un evento de seguro u otra condición relevante. No todos los salvage son iguales.",
  },
  {
    href: "/guias/leer-publicacion-copart-iaa",
    title: "¿Qué significa Run & Drive?",
    copy: "Indica que el vehículo arranca y se desplaza en el momento de la inspección. No sustituye un diagnóstico completo.",
  },
  {
    href: "/guias/calcular-costo-total-importar-vehiculo",
    title: "¿Qué es el valor CIF?",
    copy: "Agrupa el valor del vehículo más flete y seguro hasta el destino. Es una referencia de llegada, no un impuesto por sí solo.",
  },
  {
    href: "/guias/comprar-vehiculos-subastas-estados-unidos-desde-rd",
    title: "¿Cómo funciona una subasta?",
    copy: "Las plataformas permiten pujar o comprar unidades con distintas condiciones. Revisamos costos e información antes de decidir.",
  },
];

export function HomeEducation() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Antes de comprar</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Información que te ayuda
          <span className="block">a tomar mejores decisiones.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="rounded-[1.25rem] border border-[#ececea] bg-[#faf9f6] p-6 transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
            >
              <h3 className="font-display text-2xl font-semibold text-[#111]">{guide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525252]">{guide.copy}</p>
              <p className="mt-5 text-sm font-semibold text-[#111]">Leer guía</p>
            </Link>
          ))}
        </div>
        <Link
          href="/guias"
          className="mt-10 inline-flex h-11 items-center justify-center rounded-[0.9rem] border border-[#111] px-5 text-sm font-semibold text-[#111] hover:bg-[#111] hover:text-white"
        >
          Ver todas las guías
        </Link>
      </div>
    </section>
  );
}
