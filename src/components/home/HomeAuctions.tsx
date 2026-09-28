import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeAuctions() {
  return (
    <Section className="section-light bg-[#f5f6f7]" tight>
      <PageContainer>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="kicker">Subastas</p>
            <h2 className="display-lg mt-3 text-[#08090b]">
              Más opciones
              <span className="block">cuando hace falta.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
              Si no está en inventario, podemos asistirte con vehículos disponibles mediante
              plataformas como Copart e IAA. Son plataformas de subasta, no socios de Valcron.
            </p>
            <ol className="mt-6 space-y-3 text-sm text-[#3a3d42]">
              <li className="flex gap-3">
                <span className="font-semibold text-[#2b6cff]">01</span>
                Dinos qué buscas
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-[#2b6cff]">02</span>
                Revisamos opciones y cotizamos
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-[#2b6cff]">03</span>
                Eliges y coordinamos el proceso contratado
              </li>
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/subastas" className="btn-primary">
                Explorar subastas
              </Link>
              <Link href="/solicitar-vehiculo" className="btn-secondary">
                Solicitar vehículo
              </Link>
            </div>
          </div>
          <div
            className="relative aspect-[5/4] overflow-hidden bg-[#12141a]"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <Image
              src={EDITORIAL.silverSedan.src}
              alt={EDITORIAL.silverSedan.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
