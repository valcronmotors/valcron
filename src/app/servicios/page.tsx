import { publicPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Car, Gavel, MessageCircle, Search, Ship } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

export const metadata = publicPageMetadata({
  title: "Servicios de dealer en Santo Domingo Este",
  description:
    "Servicios de Valcron Motors: inventario local, subastas de Estados Unidos, importación a República Dominicana, búsqueda personalizada y asesoría.",
  path: "/servicios",
});

const SERVICES = [
  {
    step: "01",
    title: "Compra en Subastas",
    copy: "Acceso y asesoría para localizar oportunidades en plataformas de subastas de Estados Unidos.",
    href: "/subastas",
    icon: Gavel,
  },
  {
    step: "02",
    title: "Importación a República Dominicana",
    copy: "Acompañamiento durante transporte, documentación, logística y proceso de importación.",
    href: "/importacion",
    icon: Ship,
  },
  {
    step: "03",
    title: "Vehículos Disponibles",
    copy: "Explora vehículos disponibles actualmente.",
    href: "/inventario",
    icon: Car,
  },
  {
    step: "04",
    title: "Búsqueda Personalizada",
    copy: "Solicita marca, modelo, año y presupuesto para localizar opciones a tu medida.",
    href: whatsappHref("Hola, quiero una búsqueda personalizada. Marca, modelo, año y presupuesto: "),
    icon: Search,
    external: true,
  },
  {
    step: "05",
    title: "Asesoría",
    copy: "Acompañamiento personalizado durante todo el proceso.",
    href: "/contacto",
    icon: MessageCircle,
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <PageHero
        kicker="Servicios"
        title="Todo lo que necesitas para encontrar tu próximo vehículo"
        subtitle={`${SITE.shortName} combina inventario local, importación desde Estados Unidos y orientación durante cada etapa del proceso.`}
        image={PAGE_HERO_IMAGES.servicios}
        imageAlt={PAGE_HERO_ALTS.servicios}
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => {
              const content = (
                <>
                  <service.icon className="h-5 w-5 text-[#f5f5f5]" strokeWidth={1.7} />
                  <p className="mt-6 kicker">{service.step}</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-white">{service.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#d4d4d4]">{service.copy}</p>
                </>
              );

              if (service.external) {
                return (
                  <a
                    key={service.step}
                    href={service.href}
                    target="_blank"
                    rel="noreferrer"
                    className="gloss-panel p-7 transition hover:-translate-y-1 hover:border-white/28"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={service.step}
                  href={service.href}
                  className="gloss-panel p-7 transition hover:-translate-y-1 hover:border-white/28"
                >
                  {content}
                </Link>
              );
            })}
          </div>
          <p className="mt-12 text-sm text-[#d4d4d4]">
            También puedes consultar opciones de{" "}
            <Link href="/financiamiento" className="text-white underline underline-offset-4 hover:text-[#C7A96B]">
              financiamiento
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
