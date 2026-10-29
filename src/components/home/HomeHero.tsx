import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

/**
 * Reference-matched split hero: Valcron orange model card on the right and
 * the customer-facing headline/actions on the left. No search form belongs here.
 */
export function HomeHero() {
  return (
    <section className="home-hero-reference section-light overflow-hidden bg-[#f7f6f2] text-[#171719]" aria-label="Portada">
      <PageContainer className="grid items-center gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-12">
        <div className="relative z-[1] max-w-[34rem]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f625b] sm:text-[11px]">
            VALCRON MOTORS · SANTO DOMINGO ESTE
          </p>
          <h1 className="mt-5 text-balance font-display text-[2.7rem] font-bold leading-[1.02] tracking-[-0.045em] sm:mt-6 sm:text-5xl lg:text-[3.65rem]">
            <span className="block">Tu próximo</span>
            <span className="block">vehículo.</span>
            <span className="mt-1 block text-[#a74718]">A tu manera.</span>
          </h1>
          <p className="mt-5 max-w-[28rem] text-sm leading-6 text-[#514d4a] sm:text-base sm:leading-7">
            Explora nuestro inventario o dinos qué buscas. Nosotros te ayudamos a encontrarlo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
            <Link href="/inventario" className="home-orange-button min-h-11 rounded-xl px-5">
              Ver vehículos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={whatsappHref("Hola, quiero solicitar una búsqueda personalizada de vehículo con Valcron Motors.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d5d0c9] bg-transparent px-5 text-sm font-semibold text-[#24211f] transition hover:bg-white">
              Solicitar una búsqueda
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[39rem]">
          <Image
            src="/marketing/honda-crv-hybrid-2026.jpg"
            alt="Honda CR-V Hybrid 2026 blanca completa sobre tarjeta naranja, con distintivo 2026 y fondo HYBRID"
            width={1320}
            height={560}
            priority
            sizes="(max-width: 1024px) 92vw, 50vw"
            className="block h-auto w-full rounded-[1.6rem] object-contain"
          />
        </div>
      </PageContainer>
    </section>
  );
}
