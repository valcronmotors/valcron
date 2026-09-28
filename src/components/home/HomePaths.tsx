import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

const PATHS = [
  {
    step: "01",
    title: "Compra local",
    copy: "Explora unidades publicadas y disponibles para compra en República Dominicana.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.citySuv,
  },
  {
    step: "02",
    title: "Búsqueda personalizada",
    copy: "Dinos marca, modelo y presupuesto. Revisamos opciones a tu medida.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar vehículo",
    image: EDITORIAL.compactSuv,
  },
  {
    step: "03",
    title: "Financiamiento",
    copy: "Orientación con bancos locales. Sin promesa de aprobación.",
    href: "/financiamiento",
    cta: "Conocer opciones",
    image: EDITORIAL.familySedan,
  },
  {
    step: "04",
    title: "Subastas e importación",
    copy: "Más opciones mediante plataformas como Copart e IAA, con proceso claro.",
    href: "/subastas",
    cta: "Explorar subastas",
    image: EDITORIAL.silverSedan,
  },
] as const;

export function HomePaths() {
  return (
    <Section className="section-light bg-[#f5f6f7]">
      <PageContainer>
        <SectionHeader
          kicker="Empieza por aquí"
          title={
            <>
              Elige cómo quieres
              <span className="block">encontrar tu vehículo.</span>
            </>
          }
          subtitle="Cuatro caminos claros. El que elijas depende de lo que buscas hoy."
        />

        <div className="mt-10 space-y-5 md:mt-12 md:space-y-6">
          {PATHS.map((path, index) => (
            <article
              key={path.step}
              className={`overflow-hidden border border-[#e4e6ea] bg-white ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } lg:flex`}
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="relative aspect-[16/10] bg-[#12141a] lg:aspect-auto lg:min-h-[18rem] lg:w-[44%]">
                <Image
                  src={path.image.src}
                  alt={path.image.alt}
                  fill
                  sizes="(max-width: 1023px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-[var(--card-padding)]">
                <p className="font-display text-sm font-bold tracking-[0.16em] text-[#2b6cff]">
                  {path.step}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#08090b] md:text-3xl">
                  {path.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-[#676a70]">
                  {path.copy}
                </p>
                <Link href={path.href} className="btn-primary mt-6 w-fit">
                  {path.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
