import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_IMAGE } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

/**
 * V18 cinematic full-bleed hero — HTML text over licensed automotive photography.
 * Mainstream SUV / crossover imagery (not snowy or desert stock).
 */
export function HomeHero() {
  return (
    <section
      className="home-hero-cinematic hero-on-dark section-dark relative isolate overflow-hidden bg-[#111111]"
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
        className="object-cover object-[68%_55%] sm:object-[62%_50%] lg:object-[58%_48%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,#111111_0%,rgba(17,17,17,0.88)_28%,rgba(17,17,17,0.45)_52%,rgba(17,17,17,0.12)_72%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111111]/75 via-transparent to-[#111111]/25"
        aria-hidden="true"
      />

      <PageContainer className="relative z-[1] flex h-full flex-col justify-end pb-8 pt-16 sm:pb-10 md:justify-center md:pb-0 md:pt-0">
        <div className="max-w-[18rem] sm:max-w-[26rem] md:max-w-[34rem] lg:max-w-[40rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Valcron Motors Group
          </p>
          <h1 className="home-hero-title mt-3 text-balance text-white">
            Más opciones.
            <span className="mt-1 block">
              Más cerca de <span className="text-[var(--brand-orange,#e85d04)]">ti.</span>
            </span>
          </h1>
          <p className="mt-3 max-w-[24rem] text-base leading-snug text-white/88 sm:mt-4 sm:text-lg lg:max-w-[30rem]">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-6 sm:mt-8">
            <Link
              href="/inventario"
              className="inline-flex h-12 min-w-[12rem] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F5F5F5] lg:h-14 lg:min-w-[14rem] lg:text-base"
            >
              Ver inventario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
