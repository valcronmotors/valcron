"use client";

import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

const slide = HOME_HERO_SLIDES[0];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6f5f1]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
        {/* Copy — primary on mobile ATF */}
        <div className="relative z-10 flex flex-col justify-center px-4 pb-8 pt-10 sm:px-6 md:px-8 md:pb-12 md:pt-14 lg:px-12 lg:py-20 xl:px-16">
          <p className="kicker">{SITE.heroEyebrow}</p>
          <h1 className="mt-4 max-w-[14ch] text-balance font-display text-[2.625rem] font-bold leading-[1.05] tracking-[-0.035em] text-[#111214] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
            Tu próximo vehículo
            <span className="block">empieza aquí.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#676a70] md:text-lg">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/inventario" className="btn-primary h-12 w-full sm:w-auto sm:min-w-[10.5rem]">
              Ver inventario
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp h-12 w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>
          <p className="mt-5 text-sm text-[#676a70]">Santo Domingo Este · Atención personalizada</p>
        </div>

        {/* Photography — edge-to-edge on desktop; large band on mobile */}
        <div className="relative min-h-[42svh] w-full bg-[#1b1d20] sm:min-h-[48svh] lg:min-h-[min(88svh,44rem)]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            fetchPriority="high"
            quality={72}
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="object-cover object-[center_40%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f6f5f1]/90 via-transparent to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#f6f5f1] to-transparent lg:block" />
          <p className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.14em] text-white/70 lg:bottom-6 lg:left-8">
            Fotografía ilustrativa
          </p>
        </div>
      </div>
    </section>
  );
}
