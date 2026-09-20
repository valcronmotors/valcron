import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { auctionFeeConfig } from "@/lib/auction-fee-config";

const MODES = [
  {
    title: "Pre-bid",
    copy: "Ofertas anticipadas sobre unidades publicadas antes de la subasta en vivo.",
  },
  {
    title: "Live auction",
    copy: "Participación durante el evento, con precios que cambian en tiempo real.",
  },
  {
    title: "Buy it now",
    copy: "Compra inmediata cuando la plataforma ofrece un precio fijo disponible.",
  },
];

export function HomeAuctions() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-32">
        <div>
          <p className="kicker">Subastas USA</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            Más opciones.
            <span className="block">Más oportunidades.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#525252]">
            Las subastas de vehículos en Estados Unidos pueden ofrecer una amplia variedad de
            unidades, condiciones y rangos de precio.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#525252]">
            Valcron Motors puede ayudarte a explorar oportunidades disponibles en plataformas como{" "}
            {auctionFeeConfig.platforms.join(", ")}.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {MODES.map((mode) => (
              <article
                key={mode.title}
                className="rounded-2xl border border-[#ececea] bg-white p-4"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111]">
                  {mode.title}
                </h3>
                <p className="mt-2 text-sm text-[#525252]">{mode.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subastas" className="btn-primary">
              Conocer cómo funcionan las subastas
            </Link>
            <Link href="/calculadoras" className="btn-secondary">
              Calcular costo de subasta
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#111] sm:aspect-[5/4]">
          <EditorialImage
            src={EDITORIAL.yard.src}
            alt={EDITORIAL.yard.alt}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
