import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";

/**
 * Compact premium home hero.
 * Editorial marketing plane only — never presented as inventory.
 * No standalone vehicle block below the CTAs.
 */
export function HomeHero() {
  return (
    <section className="hero-on-dark relative isolate overflow-hidden bg-[#08090b]">
      <Image
        src="/hero-luxury.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={72}
        sizes="100vw"
        className="object-cover object-[68%_42%] opacity-90"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/82 to-[#08090b]/35"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-[#08090b]/40"
        aria-hidden="true"
      />

      <PageContainer className="relative pb-10 pt-14 text-left md:pb-14 md:pt-20">
        <div className="mx-auto max-w-[40rem] md:mx-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
            Valcron Motors
          </p>
          <h1 className="display-xl mt-3 text-balance text-white sm:mt-4">
            Más opciones.
            <span className="block">
              <span className="text-[#7aa2ff]">Más cerca</span> de ti.
            </span>
          </h1>
          <p className="mt-3 max-w-[26rem] text-[length:var(--text-body-lg)] leading-[1.45] text-white/72">
            Inventario real. Solicita el vehículo que buscas.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
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
      </PageContainer>
    </section>
  );
}
