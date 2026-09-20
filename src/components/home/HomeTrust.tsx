const ITEMS = [
  {
    title: "Información",
    copy: "Conoce los elementos importantes antes de tomar una decisión.",
  },
  {
    title: "Opciones",
    copy: "Explora inventario, importación y oportunidades de subasta.",
  },
  {
    title: "Acompañamiento",
    copy: "Obtén orientación durante las diferentes etapas.",
  },
  {
    title: "Tecnología",
    copy: "Utiliza herramientas digitales para explorar opciones y costos.",
  },
];

export function HomeTrust() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Por qué Valcron</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Una experiencia
          <span className="block">más clara.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.25rem] border border-[#ececea] bg-white p-6"
            >
              <h3 className="font-display text-xl font-semibold text-[#111]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525252]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
