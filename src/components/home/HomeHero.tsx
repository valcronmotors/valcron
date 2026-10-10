import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { SITE } from "@/lib/site";

/**
 * V19 typographic hero — no photograph.
 * Graphite + official Valcron orange (#EC752F from logo sampling).
 */
export function HomeHero() {
  return (
    <section className="home-hero-type section-light relative bg-[#F5F5F5]" aria-label="Portada">
      <PageContainer className="flex flex-col items-center py-12 text-center sm:py-14 md:py-16 lg:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
          Valcron Motors Group
        </p>
        <h1 className="home-hero-title mt-4 max-w-[18ch] text-balance sm:mt-5">
          <span className="block text-[#3B3B3B]">Más opciones.</span>
          <span className="mt-1 block text-[var(--brand-orange,#ec752f)]">Más cerca de ti.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[28rem] text-base leading-relaxed text-[#3B3B3B] sm:mt-5 sm:text-lg">
          {SITE.heroSubtitle}
        </p>
        <div className="mt-7 flex w-full justify-center sm:mt-8">
          <Link
            href="/inventario"
            className="inline-flex h-12 min-w-[12.5rem] items-center justify-center gap-2 rounded-full bg-[#111111] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#3B3B3B] lg:h-14 lg:min-w-[14rem] lg:text-base"
          >
            Ver inventario
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
