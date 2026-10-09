import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/public/layout";

/**
 * Full-bleed cinematic hero — OEM catalog language, Valcron copy.
 */
export function HomeHero() {
  return (
    <section className="hero-on-dark relative isolate h-[72vh] overflow-hidden bg-[#0b0c10] md:h-[82vh]">
      <Image
        src="/hero-luxury.png"
        alt="Vehículo destacado Valcron Motors"
        fill
        priority
        fetchPriority="high"
        quality={78}
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/75 via-[#08090b]/20 to-[#08090b]/10" />
      <PageContainer className="relative flex h-full flex-col items-center justify-end pb-12 pt-24 text-center md:pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Valcron Motors</p>
        <h1 className="display-xl mt-3 max-w-[18ch] text-balance text-white">
          Más opciones. Más cerca de ti.
        </h1>
        <p className="mt-4 max-w-[28rem] text-[length:var(--text-body-lg)] text-white/80">
          Inventario local en Santo Domingo Este y nuevas opciones cuando las necesitas.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link href="/inventario" className="btn-primary min-w-[11rem]">
            Ver inventario
          </Link>
          <Link href="/solicitar-vehiculo" className="btn-secondary min-w-[11rem]">
            Solicitar vehículo
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
