const LOCAL = [
  { step: "01", title: "Explora", copy: "Revisa el inventario publicado." },
  { step: "02", title: "Consulta", copy: "Escríbenos o visítanos con tus dudas." },
  { step: "03", title: "Evalúa tus opciones", copy: "Compara unidad, precio y financiamiento." },
  { step: "04", title: "Completa el proceso", copy: "Cierra la compra con acompañamiento." },
];

const SOURCING = [
  { step: "01", title: "Dinos qué buscas", copy: "Marca, modelo, año y presupuesto." },
  { step: "02", title: "Revisamos opciones", copy: "Inventario y fuentes adecuadas." },
  { step: "03", title: "Cotizamos", copy: "Costos y escenarios claros." },
  { step: "04", title: "Seleccionas", copy: "Eliges la unidad que te conviene." },
  { step: "05", title: "Gestionamos el proceso contratado", copy: "Te acompañamos hasta el cierre." },
];

export function HomeProcess() {
  return (
    <section id="proceso" className="section-dark bg-[#08090b]">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
        <p className="kicker text-[#2b6cff]">Cómo comprar</p>
        <h2 className="display-section mt-4 max-w-2xl text-white">
          Un proceso corto,
          <span className="block">sin rodeos.</span>
        </h2>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Inventario local
            </h3>
            <ol className="mt-6 space-y-0">
              {LOCAL.map((item) => (
                <li
                  key={item.step}
                  className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/10 py-5"
                >
                  <span className="font-display text-sm font-semibold tracking-[0.14em] text-[#2b6cff]">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-white md:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-white/60">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Búsqueda y subasta
            </h3>
            <ol className="mt-6 space-y-0">
              {SOURCING.map((item) => (
                <li
                  key={item.step}
                  className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/10 py-5"
                >
                  <span className="font-display text-sm font-semibold tracking-[0.14em] text-[#2b6cff]">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-white md:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-white/60">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
