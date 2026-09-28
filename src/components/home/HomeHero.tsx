"use client";

import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

const slide = HOME_HERO_SLIDES[0];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f6f7]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
        <div className="relative z-10 flex flex-col justify-center px-4 pb-8 pt-10 sm:px-6 md:px-8 md:pb-12 md:pt-14 lg:px-12 lg:py-20 xl:px-16">
          <p className="kicker">{SITE.heroEyebrow}</p>
          <h1 className="mt-4 max-w-[12ch] text-balance font-display text-[2.625rem] font-bold leading-[1.05] tracking-[-0.035em] text-[#08090b] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]">
            Tu próximo vehículo,
            <span className="block">más simple.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#676a70] md:text-lg">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/inventario" className="btn-primary h-12 w-full sm:w-auto sm:min-w-[10.5rem]">
              Ver inventario
            </Link>
            <Link href="/contacto" className="btn-secondary h-12 w-full sm:w-auto sm:min-w-[10.5rem]">
              Solicitar vehículo
            </Link>
          </div>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#128c4b] underline-offset-4 hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp {SITE.whatsappDisplay}
          </a>
          <p className="mt-4 text-sm text-[#676a70]">Santo Domingo Este · Atención personalizada</p>
        </div>

        <div className="relative min-h-[42svh] w-full bg-[#12141a] sm:min-h-[48svh] lg:min-h-[min(88svh,42rem)]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            fetchPriority="high"
            quality={72}
            sizes="(max-width: 1023px) 100vw, 52vw"
            className="object-cover object-[center_40%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f5f6f7]/90 via-transparent to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#f5f6f7] to-transparent lg:block" />
          <p className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.14em] text-white/70 lg:bottom-6 lg:left-8">
            Fotografía ilustrativa
          </p>
        </div>
      </div>
    </section>
  );
}
