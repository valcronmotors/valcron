const LOCAL = [
  { step: "01", title: "Explora", copy: "Revisa el inventario publicado." },
  { step: "02", title: "Consulta", copy: "Escríbenos o visítanos con tus dudas." },
  { step: "03", title: "Evalúa", copy: "Compara unidad, precio y financiamiento." },
  { step: "04", title: "Compra", copy: "Completa el proceso con acompañamiento." },
];

const SOURCING = [
  { step: "01", title: "Dinos qué buscas" },
  { step: "02", title: "Revisamos opciones" },
  { step: "03", title: "Cotizamos el proceso" },
  { step: "04", title: "Seleccionas la unidad" },
  { step: "05", title: "Valcron gestiona el proceso contratado" },
];

export function HomeProcess() {
  return (
    <section id="proceso" className="bg-[#141414]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <p className="kicker text-[#C7A96B]">Cómo comprar</p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
          Un proceso corto, sin rodeos.
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Inventario local</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {LOCAL.map((item) => (
                <article key={item.step} className="rounded-xl border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#C7A96B]">{item.step}</p>
                  <h4 className="mt-2 font-display text-lg font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-white/70">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Búsqueda y subasta</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {SOURCING.map((item) => (
                <article key={item.step} className="rounded-xl border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#C7A96B]">{item.step}</p>
                  <h4 className="mt-2 font-display text-lg font-semibold text-white">{item.title}</h4>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
