import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";

/**
 * Clean light editorial home hero.
 * No vehicle photograph. One CTA only.
 * Desktop is a wider editorial composition, not a mobile block centered on a monitor.
 */
export function HomeHero() {
  return (
    <section className="relative bg-white">
      <PageContainer className="pb-8 pt-8 text-center md:pb-9 md:pt-9 lg:pb-8 lg:pt-8 lg:text-left xl:pb-10 xl:pt-10">
        <div className="mx-auto sm:max-w-[36rem] lg:mx-0 lg:max-w-[46rem] xl:max-w-[52rem]">
          <p
            className="inline-flex min-h-9 items-center border border-[#e4e6ea] bg-white px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3a3d42]"
            style={{ borderRadius: "9999px" }}
          >
            Tu próximo vehículo
          </p>
          <h1 className="display-xl mt-5 text-balance text-[#08090b] sm:mt-6 lg:mt-6">
            Más opciones.
            <span className="mt-0 block lg:mt-1">
              <span className="text-[#2b6cff]">Más cerca de ti.</span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-[22rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70] sm:max-w-[32rem] lg:mx-0 lg:mt-5 lg:max-w-[36rem]">
            Encuentra vehículos disponibles y nuevas opciones con Valcron Motors.
          </p>
          <div className="mt-7 flex justify-center sm:mt-8 lg:mt-8 lg:justify-start">
            <Link href="/inventario" className="btn-primary min-w-[12.5rem] lg:h-14 lg:min-w-[14.5rem] lg:px-8">
              Ver inventario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
