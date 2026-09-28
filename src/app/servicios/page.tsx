import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Car, Calculator, Gavel, RefreshCcw, Search, Ship } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Servicios de dealer en Santo Domingo Este",
  description:
    "Servicios de Valcron Motors: venta de vehículos, búsqueda personalizada, subastas en EE.UU., importación, financiamiento con bancos locales y trade-in.",
  path: "/servicios",
});

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
    copy: "Te ayudamos a localizar vehículos disponibles mediante subastas en Copart e IAA y gestionar el proceso.",
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
    cta: "Conocer opciones",
    icon: Calculator,
  },
  {
    title: "Recibimos tu vehículo",
    copy: "¿Tienes un vehículo para entregar? Podemos evaluarlo como parte del proceso de compra.",
    href: "/solicitar-vehiculo",
    cta: "Consultar mi vehículo",
    icon: RefreshCcw,
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Cómo te ayudamos a conseguir tu vehículo"
        subtitle={`Conoce las soluciones de ${SITE.shortName} para encontrar, evaluar y adquirir tu próximo vehículo en República Dominicana.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <section className="section-light bg-[#f7f5f1]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <article key={service.title} className="rounded-2xl border border-[#e6e2db] bg-white p-6">
                <service.icon className="h-5 w-5 text-[#9b793f]" strokeWidth={1.7} />
                <h2 className="mt-4 font-display text-xl font-semibold text-[#141414]">{service.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5c5c5c]">{service.copy}</p>
                <Link
                  href={service.href}
                  className="mt-4 inline-block text-sm font-semibold text-[#141414] underline-offset-4 hover:underline"
                >
                  {service.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
