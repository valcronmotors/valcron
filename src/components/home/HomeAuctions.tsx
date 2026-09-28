import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeAuctions() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div>
          <p className="kicker">Subastas en EE.UU.</p>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-[#141414] md:text-4xl">
            Si no está en inventario, podemos buscarlo.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5c5c5c]">
            Valcron puede ayudarte a localizar vehículos disponibles mediante subastas en Estados
            Unidos y gestionar el proceso. Copart e IAA son plataformas, no socios.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subastas" className="btn-primary">
              Explorar oportunidades
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary">
              Solicitar vehículo
            </Link>
          </div>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#111]">
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
