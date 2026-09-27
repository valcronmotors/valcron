import Link from "next/link";
import { Car, Calculator, Gavel, RefreshCcw, Search, Ship } from "lucide-react";

const SERVICES = [
  {
    title: "Venta de vehículos",
    copy: "Unidades publicadas en inventario, listas para evaluar y comprar en República Dominicana.",
    href: "/inventario",
    cta: "Ver inventario",
    icon: Car,
  },
  {
    title: "Búsqueda personalizada",
    copy: "Dinos marca, modelo, año y presupuesto. Buscamos opciones que encajen.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    icon: Search,
  },
  {
    title: "Subastas en EE.UU.",
    copy: "Te ayudamos a localizar y gestionar vehículos elegibles en Copart e IAA.",
    href: "/subastas",
    cta: "Explorar oportunidades",
    icon: Gavel,
  },
  {
    title: "Importación",
    copy: "Acompañamos el proceso de transporte, costos y llegada a República Dominicana.",
    href: "/importacion",
    cta: "Ver importación",
    icon: Ship,
  },
  {
    title: "Financiamiento",
    copy: "Orientación para presentar tu caso ante bancos locales. Valcron no es el prestamista.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
    icon: Calculator,
  },
  {
    title: "Trade-in",
    copy: "Recibimos tu vehículo actual como parte de la compra, sujeto a evaluación.",
    href: "/solicitar-vehiculo",
    cta: "Consultar trade-in",
    icon: RefreshCcw,
  },
];

export function HomeServices() {
  return (
    <section className="section-light bg-[#f3f1ed]">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <p className="kicker">Servicios</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-[#141414] sm:text-4xl">
          Cómo te ayudamos a conseguir tu vehículo.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="rounded-2xl border border-[#e6e2db] bg-white p-6">
              <service.icon className="h-5 w-5 text-[#9b793f]" strokeWidth={1.7} />
              <h3 className="mt-4 font-display text-xl font-semibold text-[#141414]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5c5c5c]">{service.copy}</p>
              <Link href={service.href} className="mt-4 inline-block text-sm font-semibold text-[#141414] underline-offset-4 hover:underline">
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
