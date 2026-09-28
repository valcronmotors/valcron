import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";

/**
 * Clean light editorial home hero (V11).
 * No vehicle photograph. One CTA only.
 */
export function HomeHero() {
  return (
    <section className="relative bg-white">
      <PageContainer className="pb-10 pt-12 text-center md:pb-14 md:pt-16 lg:pt-20">
        <div className="mx-auto max-w-[34rem]">
          <p
            className="mx-auto inline-flex min-h-9 items-center border border-[#e4e6ea] bg-white px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3a3d42]"
            style={{ borderRadius: "9999px" }}
          >
            Tu próximo vehículo
          </p>
          <h1 className="display-xl mt-6 text-balance text-[#08090b] sm:mt-7">
            Más opciones.
            <span className="block">
              <span className="text-[#2b6cff]">Más cerca de ti.</span>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[26rem] text-[length:var(--text-body-lg)] leading-[1.5] text-[#676a70]">
            Encuentra vehículos disponibles y nuevas opciones con Valcron Motors.
          </p>
          <div className="mt-8 flex justify-center sm:mt-9">
            <Link href="/inventario" className="btn-primary min-w-[12rem]">
              Ver inventario
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
