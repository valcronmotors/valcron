export function HomeEditorial() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <p className="kicker">Por qué Valcron</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div>
            <h2 className="max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
              Completa tu compra de vehículo aquí.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#525252]">
              Valcron Motors Group, SRL es un dealer en Santo Domingo Este. Te ayudamos a
              encontrar, evaluar y adquirir tu próximo vehículo, con información clara en cada
              paso.
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#737373]">
            Inventario publicado, búsqueda a tu medida, escenarios de financiamiento con bancos
            locales y orientación para seguro o protección cuando aplique. Sin superlativos ni
            cifras inventadas: el catálogo y el contacto reales son la referencia.
          </p>
        </div>
      </div>
    </section>
  );
}
