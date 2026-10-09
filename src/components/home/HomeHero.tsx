import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_IMAGE } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

/**
 * Cinematic full-bleed hero — V13 photography with OEM overlay CTAs.
 */
export function HomeHero() {
  return (
    <section
      className="home-hero-cinematic hero-on-dark section-dark relative isolate overflow-hidden bg-[#08090b]"
      aria-label="Portada"
    >
      <Image
        src={HOME_HERO_IMAGE.src}
        alt={HOME_HERO_IMAGE.alt}
        fill
        priority
        fetchPriority="high"
        quality={82}
        sizes="100vw"
        className="object-cover object-[72%_45%] sm:object-[78%_42%] lg:object-[82%_40%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08090b]/92 via-[#08090b]/55 to-[#08090b]/10 sm:via-[#08090b]/50 sm:to-transparent lg:from-[#08090b]/90 lg:via-[#08090b]/42 lg:to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090b]/75 via-transparent to-[#08090b]/25"
        aria-hidden="true"
      />

      <PageContainer className="relative z-[1] flex h-full flex-col justify-end pb-8 pt-10 sm:pb-10 sm:pt-12 md:justify-center md:pb-12 md:pt-14 lg:pb-14 lg:pt-16">
        <div className="max-w-[22rem] sm:max-w-[28rem] md:max-w-[34rem] lg:max-w-[40rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Valcron Motors Group
          </p>
          <h1 className="home-hero-title mt-3 text-balance text-white sm:mt-4">
            Más opciones.
            <span className="mt-0.5 block">Más cerca de ti.</span>
          </h1>
          <p className="mt-3 max-w-[26rem] text-[length:var(--text-body-lg)] leading-[1.5] text-white/85 sm:mt-4 lg:max-w-[30rem]">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row lg:mt-8">
            <Link href="/inventario" className="btn-primary min-w-[12rem] lg:h-14 lg:min-w-[13.5rem] lg:px-8">
              Ver inventario
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary min-w-[12rem] lg:h-14">
              Solicitar vehículo
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
