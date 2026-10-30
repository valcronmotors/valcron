import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

/**
 * Exact user-supplied campaign artwork. The full 16:9 image stays visible
 * on mobile and desktop; never crop it or overlay duplicate marketing copy.
 */
export function HomeHero() {
  return (
    <section className="section-light overflow-hidden bg-[#f7f6f2]" aria-label="Portada Valcron Motors">
      <PageContainer className="py-3 sm:py-6 lg:py-9">
        <h1 className="sr-only">Tu próximo vehículo. A tu manera. Valcron Motors</h1>
        <div className="mx-auto w-full max-w-[90rem] overflow-hidden rounded-xl bg-[#f2f0ed] shadow-[0_14px_40px_-32px_rgba(0,0,0,.25)] sm:rounded-[1.75rem]">
          <Image
            src="/marketing/F068BDCD-9A45-4204-B76D-AC009AA500B1.png"
            alt="Valcron Motors Santo Domingo Este: Tu próximo vehículo. A tu manera. Honda CR-V Hybrid 2026 blanca sobre fondo naranja."
            width={1536}
            height={864}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            className="block h-auto w-full object-contain"
          />
        </div>
        <div className="mx-auto mt-4 grid w-full max-w-[42rem] grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4">
          <Link
            href="/inventario"
            className="home-orange-button flex min-h-12 w-full items-center justify-center gap-1 rounded-xl px-2 text-center text-[12px] font-bold sm:min-h-14 sm:gap-2 sm:px-4 sm:text-base"
          >
            Ver inventario <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <a
            href={whatsappHref("Hola, quiero solicitar una búsqueda personalizada de vehículo con Valcron Motors.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-1 rounded-xl border border-[#cbc5c0] bg-white px-2 text-center text-[12px] font-bold text-[#24211f] transition hover:bg-[#fff4ed] sm:min-h-14 sm:gap-2 sm:px-4 sm:text-base"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" /> Solicitar búsqueda
          </a>
        </div>
      </PageContainer>
    </section>
  );
}
