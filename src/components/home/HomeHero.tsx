import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

/**
 * Mobile-first hero: the supplied campaign artwork contains the full headline,
 * vehicle and 2026 label. Do not overlay duplicate text on top of the artwork.
 */
export function HomeHero() {
  return (
    <section className="section-light overflow-hidden bg-[#f7f6f2]" aria-label="Portada Valcron Motors">
      <PageContainer className="py-4 sm:py-6 lg:py-9">
        <div className="mx-auto max-w-[90rem] overflow-hidden rounded-2xl bg-[#f3f1ee] shadow-[0_14px_40px_-32px_rgba(0,0,0,.25)] sm:rounded-[1.75rem]">
          <Image
            src="/marketing/valcron-hero-campaign-2026.jpg"
            alt="Tu próximo vehículo. A tu manera. Honda CR-V Hybrid 2026, Valcron Motors Santo Domingo Este"
            width={1536}
            height={864}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            className="block h-auto w-full object-contain"
          />
        </div>
        <div className="mx-auto mt-4 grid w-full max-w-[38rem] grid-cols-2 gap-2.5 sm:mt-5 sm:gap-4">
          <Link
            href="/inventario"
            className="home-orange-button flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-center text-[12px] font-bold sm:min-h-14 sm:gap-2 sm:px-5 sm:text-base"
          >
            Ver inventario <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
          <a
            href={whatsappHref("Hola, quiero solicitar una búsqueda personalizada de vehículo con Valcron Motors.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-[#c9c2bc] bg-white px-2 text-center text-[12px] font-bold text-[#24211f] transition hover:bg-[#fff4ed] sm:min-h-14 sm:gap-2 sm:px-5 sm:text-base"
          >
            <Search aria-hidden="true" className="h-4 w-4 shrink-0" /> Solicitar búsqueda
          </a>
        </div>
      </PageContainer>
    </section>
  );
}
