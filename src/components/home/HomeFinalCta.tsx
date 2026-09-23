import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeFinalCta() {
  return (
    <section className="relative isolate min-h-[64vh] overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.crossover.src}
        alt={EDITORIAL.crossover.alt}
        sizes="100vw"
        className="object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-black/62" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
      <div className="relative mx-auto flex min-h-[64vh] max-w-7xl items-end px-5 py-24 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-5 h-px w-16 bg-[#C7A96B]" />
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
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
              Buscar vehículo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
