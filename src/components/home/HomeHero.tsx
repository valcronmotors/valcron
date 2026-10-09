import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_IMAGE } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

/** Full-bleed automotive banner. One headline, one primary action. */
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
        className="object-cover object-[78%_62%] sm:object-[74%_55%] lg:object-[72%_48%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#08090b_0%,rgba(8,9,11,0.82)_34%,rgba(8,9,11,0.28)_62%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090b]/70 via-transparent to-[#08090b]/20"
        aria-hidden="true"
      />

      <PageContainer className="relative z-[1] flex h-full flex-col justify-end pb-7 pt-16 sm:pb-9 md:justify-center md:pb-0 md:pt-0 lg:pb-2">
        <div className="max-w-[17.5rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-[38rem]">
          <h1 className="home-hero-title text-balance text-white">
            Más opciones.
            <span className="mt-1 block">Más cerca de ti.</span>
          </h1>
          <p className="mt-3 max-w-[22rem] text-base leading-snug text-white/88 sm:mt-4 sm:text-lg lg:max-w-[28rem]">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-5 sm:mt-7">
            <Link href="/inventario" className="btn-primary min-w-[11.5rem] lg:h-14 lg:min-w-[13.5rem] lg:px-8">
              Ver inventario
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
