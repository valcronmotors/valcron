import Link from "next/link";
import { ArrowRight, Car, Gavel, Globe2, Landmark, RefreshCw } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const SERVICES = [
  {
    title: "Compra de vehículos",
    copy: "Explora vehículos disponibles y solicita un modelo específico.",
    href: "/inventario",
    cta: "Ver inventario",
    Icon: Car,
  },
  {
    title: "Subastas en Estados Unidos",
    copy: "Explora oportunidades seleccionadas con acompañamiento de Valcron.",
    href: "/subastas",
    cta: "Ver subastas",
    Icon: Gavel,
  },
  {
    title: "Importación",
    copy: "Coordina el proceso de traer un vehículo a República Dominicana.",
    href: "/importacion",
    cta: "Cómo funciona",
    Icon: Globe2,
  },
  {
    title: "Financiamiento con bancos locales",
    copy: "Orientación sobre opciones disponibles; la aprobación depende de cada entidad.",
    href: "/financiamiento",
    cta: "Más información",
    Icon: Landmark,
  },
  {
    title: "Entrega de vehículo como parte de pago",
    copy: "Consulta posibilidades de entrega de tu vehículo actual.",
    href: "/contacto",
    cta: "Consultar",
    Icon: RefreshCw,
  },
] as const;

/** Compact editorial service cards — customer paths without oversized blocks. */
export function HomeServiceCards() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <div className="max-w-[36rem] md:max-w-none">
          <p className="kicker !text-[#676a70]">Opciones de compra</p>
          <h2 className="display-lg mt-2 text-balance text-[#08090b]">
            Elige el camino que
            <span className="block">mejor se adapte a ti.</span>
          </h2>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {SERVICES.map(({ title, copy, href, cta, Icon }) => (
            <li key={title} className={title.includes("parte de pago") ? "sm:col-span-2 lg:col-span-1" : undefined}>
              <article
                className="flex h-full flex-col border border-[#e4e6ea] bg-white p-5 sm:p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08090b] text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold tracking-tight text-[#08090b]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#676a70]">{copy}</p>
                <Link
                  href={href}
                  className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#2b6cff]"
                >
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
