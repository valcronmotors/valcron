import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { auctionFeeConfig } from "@/lib/auction-fee-config";
import { whatsappHref } from "@/lib/site";

export function HomeAuctions() {
  return (
    <section className="relative isolate overflow-hidden bg-[#080808]">
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2">
        <EditorialImage
          src={EDITORIAL.yard.src}
          alt={EDITORIAL.yard.alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-50 lg:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="kicker">Subastas internacionales</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Más opciones.
            <span className="block">Más oportunidades.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/58 sm:text-base">
            Podemos ayudarte a buscar vehículos disponibles mediante plataformas de subastas de
            Estados Unidos. Buscamos oportunidades en plataformas como{" "}
            {auctionFeeConfig.platforms.join(", ")}.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/38">
            Valcron Motors no afirma ser socio oficial, partner ni representante autorizado de estas
            compañías.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subastas" className="btn-primary">
              Explorar Subastas
            </Link>
            <a
              href={whatsappHref(
                "Hola, quiero calcular o solicitar una búsqueda de vehículo en subastas de Estados Unidos.",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Calcular costo de subasta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
