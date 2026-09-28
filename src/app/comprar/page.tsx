import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Cómo comprar un vehículo en Valcron Motors",
  description:
    "Compra en inventario, solicita un vehículo, financiamiento o subastas. Valcron Motors, Santo Domingo Este.",
  path: "/comprar",
});

const OPTIONS = [
  {
    title: "Vehículos en Valcron",
    copy: "Unidades publicadas y disponibles.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.citySuv,
  },
  {
    title: "Solicitar vehículo",
    copy: "Dinos marca, modelo y presupuesto.",
    href: "/solicitar-vehiculo",
    cta: "Solicitar",
    image: EDITORIAL.compactSuv,
  },
  {
    title: "Financiamiento",
    copy: "Orientación con bancos locales.",
    href: "/financiamiento",
    cta: "Conocer opciones",
    image: EDITORIAL.familySedan,
  },
  {
    title: "Subastas",
    copy: "Más opciones en Copart e IAA.",
    href: "/subastas",
    cta: "Explorar",
    image: EDITORIAL.silverSedan,
  },
] as const;

export default function ComprarPage() {
  return (
    <main>
      <Section className="section-light bg-white" tight>
        <PageContainer>
          <p className="kicker !text-[#676a70]">Comprar</p>
          <h1 className="display-lg mt-3 max-w-[16ch] text-[#08090b]">
            Más opciones.
            <span className="block">Más claridad.</span>
          </h1>
          <p className="mt-4 max-w-md text-[length:var(--text-body-lg)] text-[#676a70]">
            Elige cómo quieres avanzar.
          </p>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <div className="grid gap-4 md:grid-cols-2">
            {OPTIONS.map((option) => (
              <article
                key={option.href}
                className="overflow-hidden border border-[#e4e6ea] bg-white"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <div className="relative aspect-[16/10] bg-[#f7f8fa]">
                  <Image
                    src={option.image.src}
                    alt={option.image.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h2 className="font-display text-xl font-bold text-[#08090b]">{option.title}</h2>
                  <p className="mt-2 text-sm text-[#676a70]">{option.copy}</p>
                  <Link href={option.href} className="btn-primary mt-5">
                    {option.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
