import Link from "next/link";
import { Car, Calculator, Gavel, MessageCircle, Search, Ship } from "lucide-react";

const SERVICES = [
  {
    step: "01",
    title: "Vehículos disponibles",
    copy: "Explora unidades disponibles actualmente en nuestro inventario.",
    href: "/inventario",
    icon: Car,
  },
  {
    step: "02",
    title: "Importación",
    copy: "Te orientamos durante el proceso de traer tu vehículo desde Estados Unidos hasta República Dominicana.",
    href: "/importacion",
    icon: Ship,
  },
  {
    step: "03",
    title: "Subastas USA",
    copy: "Explora oportunidades provenientes de plataformas de subastas estadounidenses.",
    href: "/subastas",
    icon: Gavel,
  },
  {
    step: "04",
    title: "Búsqueda personalizada",
    copy: "Si no encuentras lo que buscas, indícanos marca, modelo, año y presupuesto.",
    href: "/contacto",
    icon: Search,
  },
  {
    step: "05",
    title: "Financiamiento",
    copy: "Explora escenarios de inicial, tasa y plazo antes de tomar una decisión.",
    href: "/financiamiento",
    icon: Calculator,
  },
  {
    step: "06",
    title: "Asesoría",
    copy: "Obtén información clara sobre las diferentes opciones disponibles.",
    href: "/servicios",
    icon: MessageCircle,
  },
];

export function HomeServices() {
  return (
    <section className="section-light bg-[#ececea]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Servicios</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Todo lo que necesitas
          <span className="block">para tu próximo vehículo.</span>
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
                Conocer más
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
