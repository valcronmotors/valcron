import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeAuctions() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="kicker">Subastas</p>
          <h2 className="display-section mt-4 text-[#08090b]">
            Más opciones.
            <span className="block">Más formas de encontrar tu vehículo.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#676a70] md:text-lg">
            Valcron puede asistirte con vehículos disponibles mediante plataformas como Copart e
            IAA. Son plataformas de subasta, no socios. Te ayudamos a evaluar la unidad y el
            proceso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subastas" className="btn-primary">
              Explorar subastas
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary">
              Solicitar vehículo
            </Link>
          </div>
        </div>
        <div
          className="relative aspect-[5/4] overflow-hidden bg-[#12141a]"
          style={{ borderRadius: "var(--radius-panel)" }}
        >
          <EditorialImage
            src={EDITORIAL.silverSedan.src}
            alt={EDITORIAL.silverSedan.alt}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
