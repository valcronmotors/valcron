import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeFinalCta() {
  return (
    <section className="relative isolate min-h-[48svh] overflow-hidden bg-black md:min-h-[58vh]">
      <EditorialImage
        src={EDITORIAL.crossover.src}
        alt={EDITORIAL.crossover.alt}
        sizes="100vw"
        className="object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-black/62" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
      <div className="hero-on-dark relative mx-auto flex min-h-[48svh] max-w-7xl items-end px-4 py-12 md:min-h-[58vh] md:px-8 md:py-20">
        <div className="max-w-2xl">
          <div className="mb-5 h-px w-16 bg-[#C7A96B]" />
          <h2 className="text-balance font-display text-[1.85rem] font-bold tracking-tight text-white md:text-5xl">
            Tu próximo vehículo puede empezar aquí.
          </h2>
          <p className="mt-5 max-w-xl text-base text-white/70">
            Explora el inventario o cuéntanos qué buscas. Te orientamos en la compra, el
            financiamiento y las opciones de protección cuando aplique.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary">
              Solicitar vehículo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
