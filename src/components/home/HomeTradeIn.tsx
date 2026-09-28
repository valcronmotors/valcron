import Link from "next/link";

export function HomeTradeIn() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <p className="kicker">Recibimos tu vehículo</p>
        <h2 className="mt-2 max-w-xl font-display text-2xl font-bold tracking-tight text-[#141414] md:text-3xl">
          ¿Tienes un vehículo para entregar?
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#5c5c5c]">
          Podemos evaluar tu unidad como parte del proceso de compra. El valor se confirma después de
          revisar la unidad.
        </p>
        <Link href="/solicitar-vehiculo" className="btn-secondary mt-5 inline-flex h-12">
          Consultar mi vehículo
        </Link>
      </div>
    </section>
  );
}
