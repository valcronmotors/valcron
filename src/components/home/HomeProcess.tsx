const STEPS = [
  { step: "01", title: "Cuéntanos qué buscas" },
  { step: "02", title: "Localizamos opciones" },
  { step: "03", title: "Revisamos costos" },
  { step: "04", title: "Decides" },
  { step: "05", title: "Gestionamos el proceso" },
  { step: "06", title: "Recibes tu vehículo" },
];

export function HomeProcess() {
  return (
    <section className="bg-[#fafafa] text-[#111111]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="kicker text-[#737373]">Cómo funciona</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Del primer mensaje a tu próximo vehículo.
        </h2>
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-6">
          {STEPS.map((item) => (
            <article key={item.step} className="border-t border-[#d4d4d4] pt-6">
              <p className="kicker">{item.step}</p>
              <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
