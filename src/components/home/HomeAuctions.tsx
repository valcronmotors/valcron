import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { auctionFeeConfig } from "@/lib/auction-fee-config";

export function HomeAuctions() {
  return (
    <section className="section-light bg-[#f5f5f3]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div>
          <p className="kicker">Otra forma de encontrar tu vehículo</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">
            Subastas: más opciones de compra.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#525252]">
            Cuando conviene, exploramos unidades publicadas en plataformas de Estados Unidos y te
            ayudamos a leer lote, título y daños antes de decidir. {auctionFeeConfig.platforms.join(", ")}{" "}
            son plataformas; no somos socios oficiales de esas compañías.
          </p>
          <Link href="/subastas" className="btn-secondary mt-8">
            Conocer subastas
          </Link>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#111]">
          <EditorialImage
            src={EDITORIAL.silverSedan.src}
            alt={EDITORIAL.silverSedan.alt}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
