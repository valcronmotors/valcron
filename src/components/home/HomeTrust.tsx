const ITEMS = [
  {
    title: "Transparencia",
    copy: "Revisamos partidas de compra, transporte e importación antes de avanzar.",
  },
  {
    title: "Información organizada",
    copy: "Ordenamos el expediente para que el proceso sea más claro.",
  },
  {
    title: "Asesoría personalizada",
    copy: "Acompañamiento alineado a tu presupuesto, marca, modelo y uso del vehículo.",
  },
  {
    title: "Opciones de compra",
    copy: "Inventario local, importación y búsqueda en plataformas de subastas.",
  },
  {
    title: "Seguimiento",
    copy: "Te mantenemos informado desde la localización hasta la entrega.",
  },
  {
    title: "Proceso estructurado",
    copy: "Una secuencia clara para decidir con más contexto, no con promesas vacías.",
  },
];

export function HomeTrust() {
  return (
    <section className="bg-[#050505]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="kicker">Por qué Valcron</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Una experiencia
          <span className="block">más clara.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ITEMS.map((item) => (
            <article key={item.title} className="gloss-panel h-full p-6">
              <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
