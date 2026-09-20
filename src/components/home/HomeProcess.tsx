const STEPS = [
  { step: "01", title: "Cuéntanos qué buscas" },
  { step: "02", title: "Exploramos opciones" },
  { step: "03", title: "Revisamos información y costos" },
  { step: "04", title: "Tú decides" },
  { step: "05", title: "Coordinamos el proceso" },
  { step: "06", title: "Entrega" },
];

export function HomeProcess() {
  return (
    <section id="proceso" className="bg-[#181818]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Cómo funciona</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Del primer mensaje
          <span className="block">a tu próximo vehículo.</span>
        </h2>
        <div className="mt-14 grid gap-0 md:grid-cols-2 xl:grid-cols-6">
          {STEPS.map((item, index) => (
            <article
              key={item.step}
              className={`relative px-1 py-6 ${
                index < STEPS.length - 1
                  ? "xl:after:absolute xl:after:right-0 xl:after:top-10 xl:after:h-px xl:after:w-full xl:after:bg-gradient-to-r xl:after:from-[#C7A96B]/70 xl:after:to-transparent"
                  : ""
              }`}
            >
              <p className="kicker">{item.step}</p>
              <h3 className="relative z-10 mt-4 max-w-[11rem] font-display text-xl font-semibold text-white">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
