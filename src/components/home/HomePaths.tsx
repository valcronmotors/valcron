import Link from "next/link";

const PATHS = [
  {
    step: "01",
    title: "Ver inventario",
    copy: "Explora unidades publicadas y disponibles para compra.",
    href: "/inventario",
    cta: "Ir al inventario",
  },
  {
    step: "02",
    title: "Solicitar un vehículo",
    copy: "Dinos qué buscas. Revisamos opciones a tu medida.",
    href: "/contacto",
    cta: "Solicitar vehículo",
  },
  {
    step: "03",
    title: "Financiamiento",
    copy: "Orientación con bancos locales. Sin promesa de aprobación.",
    href: "/financiamiento",
    cta: "Conocer opciones",
  },
  {
    step: "04",
    title: "Subastas",
    copy: "Más opciones mediante plataformas como Copart e IAA.",
    href: "/subastas",
    cta: "Explorar subastas",
  },
] as const;

export function HomePaths() {
  return (
    <section className="section-light bg-[#f5f6f7]">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <p className="kicker">Empieza por aquí</p>
        <h2 className="display-section mt-3 max-w-2xl text-[#08090b]">
          Elige cómo quieres avanzar.
        </h2>
        <div className="mt-10 grid gap-0 border-t border-[#e4e6ea] md:grid-cols-2">
          {PATHS.map((path) => (
            <article
              key={path.step}
              className="border-b border-[#e4e6ea] py-8 md:border-r md:px-8 md:odd:pl-0 md:even:border-r-0 md:even:pr-0"
            >
              <p className="font-display text-sm font-semibold tracking-[0.16em] text-[#2b6cff]">
                {path.step}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-[#08090b] md:text-2xl">
                {path.title}
              </h3>
              <p className="mt-2 max-w-md text-base text-[#676a70]">{path.copy}</p>
              <Link
                href={path.href}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
              >
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
