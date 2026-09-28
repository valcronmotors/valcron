import Link from "next/link";

export function HomeTradeIn() {
  return (
    <section className="section-light bg-[#f5f6f7]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="max-w-2xl border-l-2 border-[#2b6cff] pl-6 md:pl-8">
          <p className="kicker">Trade-in</p>
          <h2 className="display-section mt-4 text-[#08090b]">
            ¿Tienes un vehículo
            <span className="block">para entregar?</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#676a70] md:text-lg">
            Podemos evaluar tu unidad como parte del proceso de compra. El valor se confirma después
            de revisar la unidad — no prometemos tasación previa.
          </p>
          <Link href="/solicitar-vehiculo" className="btn-primary mt-8 inline-flex">
            Consultar mi vehículo
          </Link>
        </div>
      </div>
    </section>
  );
}
