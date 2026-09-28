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
      <PageContainer className="pb-2 pt-7 md:pb-0 md:pt-10 lg:pt-12">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
          <div className="relative z-10 max-w-[22rem] text-left sm:max-w-[28rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#676a70]">
              Tu próximo vehículo
            </p>
            <h1 className="display-xl mt-3 text-balance text-[#08090b] sm:mt-4">
              Más opciones.
              <span className="block">
                <span className="text-[#2b6cff]">Más cerca</span> de ti.
              </span>
            </h1>
            <p className="mt-4 max-w-[24rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70]">
              Explora nuestras unidades o solicita el vehículo que buscas.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </div>

          <div className="relative -mx-[var(--page-gutter)] lg:mx-0 lg:-mr-[calc(var(--page-gutter)+1rem)]">
            <div className="relative min-h-[17.5rem] overflow-hidden bg-gradient-to-b from-[#eef0f3]/80 via-[#f7f8fa] to-white sm:min-h-[21rem] lg:min-h-[28rem]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority
                fetchPriority="high"
                quality={82}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 44rem"
                className="object-contain object-[center_80%] scale-[1.12] sm:scale-[1.15] lg:object-right-bottom"
              />
            </div>
            <p className="mt-2 px-[var(--page-gutter)] text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[#676a70] lg:absolute lg:bottom-3 lg:right-4 lg:mt-0 lg:px-0 lg:text-right">
              Fotografía ilustrativa · Marketing
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
