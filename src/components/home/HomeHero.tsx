import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { HOME_BANNER_IMAGE } from "@/lib/hero-media";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";
import { SITE, whatsappHref } from "@/lib/site";

/**
 * Original cinematic photo hero. Search controls intentionally do not live here;
 * primary inventory/WhatsApp actions and the independent brand navigation remain.
 */
export function HomeHero() {
  return (
    <section
      className="home-hero-cinematic hero-on-dark section-dark relative isolate overflow-hidden bg-[#08090b]"
      aria-label="Portada"
    >
      <Image
        src={HOME_BANNER_IMAGE.src}
        alt={HOME_BANNER_IMAGE.alt}
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
            <span className="mt-0.5 block">
              <span className="text-[#2b6cff]">Más cerca de ti.</span>
            </span>
          </h1>
          <p className="mt-3 max-w-[26rem] text-[length:var(--text-body-lg)] leading-[1.5] text-white/85 sm:mt-4 lg:max-w-[30rem]">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 lg:mt-8">
            <Link href="/inventario" className="btn-primary min-h-11 min-w-[12rem] lg:h-14 lg:min-w-[13.5rem] lg:px-8">
              Ver todo el inventario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={whatsappHref("Hola, quiero conocer los vehículos disponibles en Valcron Motors.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 lg:min-h-14"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <nav className="relative mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/20 pt-3 sm:mt-8 sm:pt-4" aria-label="Explorar por marca">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">Marcas</span>
          {VEHICLE_BRANDS.slice(0, 8).map((brand) => (
            <Link
              key={brand.slug}
              href={`/inventario?marca=${encodeURIComponent(brand.name)}`}
              className="text-xs font-medium text-white/85 underline-offset-4 transition hover:text-white hover:underline"
            >
              {brand.name}
            </Link>
          ))}
        </nav>
      </PageContainer>
    </section>
  );
}
