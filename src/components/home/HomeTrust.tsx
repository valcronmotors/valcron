const ITEMS = [
  {
    step: "01",
    title: "Atención personalizada",
    copy: "Un trato directo para entender qué buscas y qué opciones tienen sentido para ti.",
  },
  {
    step: "02",
    title: "Inventario y búsqueda a la medida",
    copy: "Unidades publicadas en República Dominicana y, cuando hace falta, búsqueda enfocada fuera del inventario.",
  },
  {
    step: "03",
    title: "Opciones de financiamiento",
    copy: "Te orientamos a preparar el caso. La aprobación y las condiciones las define cada banco local.",
  },
  {
    step: "04",
    title: "Vehículos mediante subasta",
    copy: "Si no está en stock, podemos explorar unidades disponibles en plataformas como Copart e IAA.",
  },
];

export function HomeTrust() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
        <p className="kicker">Por qué Valcron</p>
        <h2 className="display-section mt-4 max-w-2xl text-[#08090b]">
          Un dealer serio,
          <span className="block">con proceso claro.</span>
        </h2>
        <div className="mt-12 grid gap-0 border-t border-[#e4e6ea] md:grid-cols-2">
          {ITEMS.map((item) => (
            <article
              key={item.step}
              className="border-b border-[#e4e6ea] py-8 md:border-r md:px-8 md:odd:pl-0 md:even:border-r-0 md:even:pr-0 lg:py-10"
            >
              <p className="font-display text-sm font-semibold tracking-[0.16em] text-[#2b6cff]">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[#08090b] md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#676a70]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
