import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const SERVICES = [
  {
    title: "Venta de vehículos",
    copy: "Unidades publicadas en inventario, listas para evaluar y comprar en República Dominicana.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.compactSuv,
  },
  {
    title: "Búsqueda personalizada",
    copy: "Dinos marca, modelo, año y presupuesto. Buscamos opciones que encajen.",
    href: "/contacto",
    cta: "Solicitar vehículo",
  },
  {
    title: "Subastas",
    copy: "Te ayudamos a localizar vehículos disponibles mediante plataformas como Copart e IAA.",
    href: "/subastas",
    cta: "Explorar subastas",
  },
  {
    title: "Importación",
    copy: "Acompañamos el proceso de transporte, costos y llegada a República Dominicana.",
    href: "/importacion",
    cta: "Ver importación",
    image: EDITORIAL.carrier,
  },
  {
    title: "Financiamiento",
    copy: "Orientación para presentar tu caso ante bancos locales. Valcron no es el prestamista.",
    href: "/financiamiento",
    cta: "Conocer opciones",
  },
  {
    title: "Trade-in",
    copy: "Recibimos tu vehículo actual como parte de la compra, sujeto a evaluación.",
    href: "/contacto",
    cta: "Consultar trade-in",
  },
];

export function HomeServices() {
  return (
    <section className="section-light bg-[#eef0f3]">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
        <p className="kicker">Servicios</p>
        <h2 className="display-section mt-4 max-w-2xl text-[#08090b]">
          Cómo te ayudamos a conseguir tu vehículo.
        </h2>

        <div className="mt-12 grid gap-px bg-[#e4e6ea] md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="flex flex-col bg-[#eef0f3]">
              {"image" in service && service.image ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-[#12141a]">
                  <EditorialImage
                    src={service.image.src}
                    alt={service.image.alt}
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-[#08090b]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-[#676a70]">{service.copy}</p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
                >
                  {service.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
