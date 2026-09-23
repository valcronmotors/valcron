import Link from "next/link";
import { Car, Calculator, Gavel, MessageCircle, Search, Ship } from "lucide-react";

const SERVICES = [
  {
    step: "01",
    title: "Vehículos disponibles",
    copy: "Explora nuestro inventario actual y encuentra unidades listas para tu próxima compra.",
    href: "/inventario",
    cta: "Ver inventario",
    icon: Car,
  },
  {
    step: "02",
    title: "Búsqueda personalizada",
    copy: "Cuéntanos qué marca, modelo, año y presupuesto tienes en mente.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    icon: Search,
  },
  {
    step: "03",
    title: "Subastas USA",
    copy: "Explora oportunidades de compra en plataformas de subastas de Estados Unidos.",
    href: "/subastas",
    cta: "Conocer subastas",
    icon: Gavel,
  },
  {
    step: "04",
    title: "Financiamiento",
    copy: "Conoce opciones y calcula escenarios de compra con bancos locales.",
    href: "/financiamiento",
    cta: "Calcular financiamiento",
    icon: Calculator,
  },
  {
    step: "05",
    title: "Importación",
    copy: "Conoce el proceso para traer un vehículo desde Estados Unidos.",
    href: "/importacion",
    cta: "Conocer importación",
    icon: Ship,
  },
  {
    step: "06",
    title: "Asesoría",
    copy: "Recibe orientación durante tu proceso de compra, de la búsqueda a la entrega.",
    href: "/servicios",
    cta: "Ver servicios",
    icon: MessageCircle,
  },
];

export function HomeServices() {
  return (
    <section className="section-light bg-[#ececea]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Servicios</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Soluciones para ayudarte
          <span className="block">a adquirir tu próximo vehículo.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.step}
              className="rounded-[1.25rem] border border-white bg-[#faf9f6] p-6 transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
            >
              <service.icon className="h-5 w-5 text-[#C7A96B]" strokeWidth={1.7} />
              <p className="mt-5 kicker">{service.step}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-[#111]">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525252]">{service.copy}</p>
              <Link href={service.href} className="mt-5 inline-block text-sm font-semibold text-[#111]">
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
