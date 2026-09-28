"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

const slide = HOME_HERO_SLIDES[0];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <PageContainer className="pb-6 pt-10 text-center md:pb-10 md:pt-14 lg:pt-16">
        <p className="motion-fade-up mx-auto inline-flex items-center rounded-full border border-[#e4e6ea] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#08090b]">
          Santo Domingo Este · República Dominicana
        </p>

        <h1 className="motion-fade-up display-xl mx-auto mt-7 max-w-[16ch] text-balance text-[#08090b] md:mt-8">
          Tu próximo vehículo,{" "}
          <span className="text-[#2b6cff]">más simple</span>.
        </h1>

        <p className="motion-fade-up-delay mx-auto mt-5 max-w-[28rem] text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
          Más opciones para encontrarlo: inventario local, búsqueda personalizada,
          financiamiento con bancos locales y subastas cuando aplica.
        </p>

        <div className="motion-fade-up-delay mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/inventario" className="btn-primary w-full sm:w-auto sm:min-w-[12rem]">
            Ver inventario
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/solicitar-vehiculo" className="btn-secondary w-full sm:w-auto sm:min-w-[12rem]">
            Solicitar vehículo
          </Link>
        </div>
      </PageContainer>

      <div className="relative mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] pb-10 md:pb-14">
        <div
          className="relative overflow-hidden bg-[#12141a]"
          style={{ borderRadius: "var(--radius-card)", aspectRatio: "16 / 11" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            fetchPriority="high"
            quality={74}
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 80vw, 72rem"
            className="object-cover object-[center_42%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090b]/55 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-left text-[11px] uppercase tracking-[0.14em] text-white/70 md:bottom-5 md:left-6">
            Fotografía ilustrativa · {SITE.shortName}
          </p>
        </div>
      </div>
    </section>
  );
}
