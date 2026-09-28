const ITEMS = [
  {
    title: "Atención personalizada",
    copy: "Un trato directo para entender qué buscas y qué opciones tienen sentido.",
  },
  {
    title: "Opciones locales y de subasta",
    copy: "Inventario en República Dominicana y, cuando hace falta, búsqueda en plataformas de EE.UU.",
  },
  {
    title: "Acompañamiento en el proceso",
    copy: "Te orientamos desde la consulta hasta la compra, sin inflar plazos ni resultados.",
  },
  {
    title: "Orientación de financiamiento",
    copy: "Te ayudamos a preparar el caso. La aprobación y las condiciones las define cada banco local.",
  },
  {
    title: "Recibimos tu vehículo",
    copy: "Recibimos tu vehículo actual como parte de la compra, sujeto a evaluación.",
  },
];

export function HomeTrust() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <p className="kicker">Por qué Valcron</p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight text-[#141414] md:text-4xl">
          Un dealer serio, con proceso claro.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ITEMS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#e6e2db] bg-[#f7f5f1] p-6">
              <h3 className="font-display text-xl font-semibold text-[#141414]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5c5c5c]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
