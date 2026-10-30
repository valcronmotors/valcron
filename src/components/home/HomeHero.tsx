import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

/**
 * Self-contained, mobile-first campaign layout. Uses the already deployed
 * CR-V artwork; no missing image upload or external image dependency.
 * Headline and CTAs are accessible HTML rather than baked-in bitmap text.
 */
export function HomeHero() {
  return (
    <section className="section-light overflow-hidden bg-[#f6f5f2] text-[#141414]" aria-label="Portada Valcron Motors">
      <PageContainer className="py-6 sm:py-9 lg:py-12">
        <div className="mx-auto grid max-w-[88rem] items-center gap-5 lg:grid-cols-[.93fr_1.07fr] lg:gap-8">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.19em] text-[#5d5853] sm:text-xs">
              VALCRON MOTORS · SANTO DOMINGO ESTE
            </p>
            <div className="mt-3 h-[2px] w-12 bg-[#f47728]" aria-hidden="true" />
            <h1 className="mt-5 font-display text-[clamp(2.5rem,10.5vw,4.6rem)] font-extrabold leading-[.99] tracking-[-.055em] lg:text-[clamp(3.5rem,5vw,5.5rem)]">
              Tu próximo<br />vehículo.<br />
              <span className="text-[#b4471a]">A tu manera.</span>
            </h1>
            <p className="mt-5 max-w-[34rem] text-sm leading-6 text-[#4e4b48] sm:text-base sm:leading-7">
              Explora nuestro inventario o dinos qué buscas. Nosotros te ayudamos a encontrarlo.
            </p>
          </div>
          <div className="relative min-w-0 overflow-hidden rounded-2xl bg-[#ff650c] shadow-[0_18px_48px_-30px_rgba(115,48,16,.4)] sm:rounded-[1.6rem]">
            <div className="relative aspect-[1320/560] w-full">
              <Image
                src="/marketing/honda-crv-hybrid-2026.jpg"
                alt="Honda CR-V Hybrid 2026 blanca sobre banner naranja"
                fill
                priority
                sizes="(max-width: 1024px) 94vw, 54vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-5 grid w-full max-w-[42rem] grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 lg:mx-0">
          <Link href="/inventario" className="home-orange-button flex min-h-12 w-full items-center justify-center gap-1 rounded-xl px-2 text-center text-[12px] font-bold sm:min-h-14 sm:gap-2 sm:px-4 sm:text-base">
            Ver inventario <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <a href={whatsappHref("Hola, quiero solicitar una búsqueda personalizada de vehículo con Valcron Motors.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-1 rounded-xl border border-[#cbc5c0] bg-white px-2 text-center text-[12px] font-bold text-[#24211f] transition hover:bg-[#fff4ed] sm:min-h-14 sm:gap-2 sm:px-4 sm:text-base">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" /> Solicitar búsqueda
          </a>
        </div>
      </PageContainer>
    </section>
  );
}
