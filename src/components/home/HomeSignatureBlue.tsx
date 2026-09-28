import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeSignatureBlue() {
  return (
    <Section className="section-accent" tight>
      <PageContainer>
        <div className="mx-auto max-w-[36rem] text-center">
          <p className="kicker">¿No está en inventario?</p>
          <h2 className="display-lg mt-4 text-balance text-white">
            Dinos cuál buscas.
          </h2>
          <p className="mt-4 text-[length:var(--text-body-lg)] leading-[1.55] text-white/85">
            Indica marca, modelo y presupuesto. Revisamos opciones en inventario,
            subasta e importación cuando aplica.
          </p>
          <Link href="/solicitar-vehiculo" className="btn-primary mt-8 bg-white text-[#08090b]">
            Solicitar vehículo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div
          className="relative mx-auto mt-10 overflow-hidden bg-white shadow-[0_24px_60px_rgba(8,9,11,0.22)] md:mt-12"
          style={{ borderRadius: "var(--radius-card)", maxWidth: "36rem" }}
        >
          <div className="relative aspect-[16/11]">
            <Image
              src={EDITORIAL.crossover.src}
              alt={EDITORIAL.crossover.alt}
              fill
              sizes="(max-width: 768px) 88vw, 36rem"
              className="object-cover object-center"
            />
          </div>
          <div className="grid gap-1 px-5 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2b6cff]">
              Búsqueda personalizada
            </p>
            <p className="font-display text-lg font-semibold text-[#08090b]">
              Tu vehículo, a tu medida
            </p>
            <p className="text-sm text-[#676a70]">
              Cotización clara · Sin compromiso inicial
            </p>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
