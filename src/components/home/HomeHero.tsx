import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { HOME_HERO_IMAGE } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

/**
 * Premium photographic home hero — one primary CTA, mobile-first stacked layout,
 * desktop two-column editorial composition.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <PageContainer className="pb-6 pt-7 md:pb-8 md:pt-8 lg:pb-10 lg:pt-10 xl:pb-12 xl:pt-12">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <div className="order-1 text-center lg:order-none lg:text-left">
            <p
              className="inline-flex min-h-9 items-center border border-[#e4e6ea] bg-white px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3a3d42]"
              style={{ borderRadius: "9999px" }}
            >
              {SITE.heroEyebrow}
            </p>
            <h1 className="display-xl mt-4 text-balance text-[#08090b] sm:mt-5 lg:mt-5">
              Más opciones.
              <span className="mt-0 block lg:mt-1">
                <span className="text-[#2b6cff]">Más cerca de ti.</span>
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-[22rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70] sm:max-w-[32rem] lg:mx-0 lg:mt-4 lg:max-w-[34rem]">
              {SITE.heroSubtitle}
            </p>
            <div className="mt-6 flex justify-center sm:mt-7 lg:mt-8 lg:justify-start">
              <Link href="/inventario" className="btn-primary min-w-[12.5rem] lg:h-14 lg:min-w-[14.5rem] lg:px-8">
                Ver inventario
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="order-2 lg:order-none">
            <div
              className="relative mx-auto aspect-[4/3] w-full max-w-[36rem] overflow-hidden border border-[#e4e6ea] bg-[#f3f4f6] shadow-[0_18px_48px_-28px_rgba(8,9,11,0.35)] sm:max-w-none lg:aspect-[5/4] lg:max-w-none xl:aspect-[16/11]"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <Image
                src={HOME_HERO_IMAGE.src}
                alt={HOME_HERO_IMAGE.alt}
                width={HOME_HERO_IMAGE.width}
                height={HOME_HERO_IMAGE.height}
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 92vw, (max-width: 1440px) 46vw, 720px"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
