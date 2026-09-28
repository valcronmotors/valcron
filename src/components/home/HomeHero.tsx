"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";

const slide = HOME_HERO_SLIDES[0];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <PageContainer className="pb-4 pt-8 text-center md:pb-6 md:pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#676a70]">
          Tu próximo vehículo
        </p>
        <h1 className="display-xl mx-auto mt-4 max-w-[14ch] text-balance text-[#08090b]">
          Más opciones.{" "}
          <span className="text-[#2b6cff]">Más cerca</span> de ti.
        </h1>
        <p className="mx-auto mt-4 max-w-[26rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70]">
          Explora nuestras unidades o solicita el vehículo que buscas.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/inventario" className="btn-primary w-full sm:w-auto sm:min-w-[11.5rem]">
            Ver inventario
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/solicitar-vehiculo"
            className="btn-secondary w-full sm:w-auto sm:min-w-[11.5rem]"
          >
            Solicitar vehículo
          </Link>
        </div>
      </PageContainer>

      <div className="relative mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] pb-8 md:pb-10">
        <div
          className="relative overflow-hidden bg-gradient-to-b from-[#eef0f3] to-[#f7f8fa]"
          style={{ borderRadius: "var(--radius-card)", aspectRatio: "5 / 4" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            fetchPriority="high"
            quality={80}
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 80vw, 72rem"
            className="object-contain object-center p-1 sm:p-3"
          />
        </div>
        <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[#676a70]">
          Fotografía ilustrativa · Marketing
        </p>
      </div>
    </section>
  );
}
