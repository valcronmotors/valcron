"use client";

import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

const slide = HOME_HERO_SLIDES[0];

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[70svh] overflow-hidden bg-[#111] md:min-h-[72vh] lg:min-h-[78vh]">
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority
        fetchPriority="high"
        quality={70}
        sizes="(max-width: 768px) 100vw, 100vw"
        className="object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-black/28" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      <div className="relative mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-end px-4 pb-8 pt-20 md:min-h-[72vh] md:px-8 md:pb-16 lg:min-h-[78vh] lg:pb-20">
        <div className="hero-on-dark max-w-xl">
          <p className="text-xs font-medium tracking-[0.16em] text-[#C7A96B]">{SITE.heroEyebrow}</p>
          <h1 className="mt-3 text-balance font-display text-[1.85rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {SITE.heroTitle}
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/85">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/inventario" className="btn-primary h-12 w-full sm:w-auto">
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
          <p className="mt-4 text-sm text-white/70">Santo Domingo Este · Atención personalizada</p>
        </div>
      </div>
    </section>
  );
}
