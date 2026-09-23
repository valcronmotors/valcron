import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeImport() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.compactSuv.src}
        alt={EDITORIAL.compactSuv.alt}
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/40" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <p className="kicker">Importación</p>
        <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Cuando la unidad viene de Estados Unidos.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4d4d4]">
          Transporte, documentos y llegada a República Dominicana se explican en la página de
          importación. Aquí el foco es completar tu compra; el detalle logístico vive aparte.
        </p>
        <Link href="/importacion" className="btn-primary mt-8">
          Conocer importación
        </Link>
      </div>
    </section>
  );
}
