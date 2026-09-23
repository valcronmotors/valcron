import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Car, Calculator, Gavel, MessageCircle, Search, Shield, ShieldCheck, Ship } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Servicios de dealer en Santo Domingo Este",
  description:
    "Servicios de Valcron Motors para comprar un vehículo en República Dominicana: inventario, búsqueda, financiamiento, orientación de seguro, protección, subastas e importación.",
  path: "/servicios",
});

const SERVICES = [
  {
    step: "01",
    title: "Venta de vehículos",
    what: "Explora unidades publicadas en inventario para compra en República Dominicana.",
    who: "Para quien busca un vehículo disponible y quiere ver opciones reales.",
    href: "/inventario",
    cta: "Ver inventario",
    icon: Car,
  },
  {
    step: "02",
    title: "Búsqueda personalizada",
    what: "Nos indicas marca, modelo, año y presupuesto para explorar opciones a tu medida.",
    who: "Para quien no encuentra exactamente lo que busca en el inventario actual.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    icon: Search,
  },
  {
    step: "03",
    title: "Financiamiento",
    what: "Simula escenarios de inicial, plazo y tasa para planificar tu compra con bancos locales.",
    who: "Para quien quiere explorar opciones antes de decidir. No somos un banco.",
    href: "/financiamiento",
    cta: "Conocer financiamiento",
    icon: Calculator,
  },
  {
    step: "04",
    title: "Seguro / orientación de cobertura",
    what: "Te orientamos para gestionar opciones de cobertura, incluida full cover cuando corresponda.",
    who: "No somos aseguradora. La cobertura la define cada compañía según sus condiciones.",
    href: "/contacto",
    cta: "Consultar opciones",
    icon: Shield,
  },
  {
    step: "05",
    title: "Garantía / protección",
    what: "Consulta opciones de garantía o protección para vehículos elegibles.",
    who: "No todas las unidades incluyen cobertura. Condiciones se confirman caso por caso.",
    href: "/contacto",
    cta: "Conocer opciones",
    icon: ShieldCheck,
  },
  {
    step: "06",
    title: "Subastas",
    what: "Otra vía para encontrar un vehículo: evaluar lote, título y daños en plataformas de EE. UU.",
    who: "Para quien quiere más opciones de compra. El detalle está en Subastas.",
    href: "/subastas",
    cta: "Conocer subastas",
    icon: Gavel,
  },
  {
    step: "07",
    title: "Importación",
    what: "Orientación para trasladar y gestionar un vehículo desde Estados Unidos hasta RD.",
    who: "Para quien ya identificó una unidad y necesita transporte, documentos y llegada.",
    href: "/importacion",
    cta: "Conocer importación",
    icon: Ship,
  },
  {
    step: "08",
    title: "Asesoría",
    what: "Acompañamiento para entender opciones, costos e información durante tu compra.",
    who: "Para quien quiere decidir con más contexto, en oficina o por WhatsApp.",
    href: "/contacto",
    cta: "Contactar",
    icon: MessageCircle,
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Todo para completar tu compra de vehículo"
        subtitle={`Conoce las soluciones de ${SITE.shortName} para encontrar, evaluar y adquirir tu próximo vehículo en República Dominicana.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((service) => (
              <article key={service.step} className="gloss-panel flex min-h-0 flex-col p-7">
                <service.icon className="h-5 w-5 text-[#f5f5f5]" strokeWidth={1.7} />
                <p className="mt-6 kicker">{service.step}</p>
                <h2 className="mt-3 text-balance font-display text-2xl font-semibold text-white">{service.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#d4d4d4]">{service.what}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#a3a3a3]">{service.who}</p>
                <Link
                  href={service.href}
                  className="mt-auto inline-flex pt-6 text-sm font-semibold text-white underline-offset-4 hover:text-[#C7A96B] hover:underline"
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
