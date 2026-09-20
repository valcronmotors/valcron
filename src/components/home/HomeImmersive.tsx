import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeImmersive() {
  return (
    <section className="relative isolate min-h-[68vh] overflow-hidden bg-black lg:min-h-[76vh]">
      <EditorialImage
        src={EDITORIAL.sunsetSuv.src}
        alt={EDITORIAL.sunsetSuv.alt}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      <div className="relative mx-auto flex min-h-[68vh] max-w-7xl items-end px-5 py-20 lg:min-h-[76vh] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 h-px w-16 bg-[#C7A96B]" />
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Tu próximo vehículo
            <span className="block">puede estar más cerca</span>
            <span className="block">de lo que piensas.</span>
          </h2>
          <Link href="/inventario" className="btn-primary mt-8">
            Explorar vehículos
          </Link>
        </div>
      </div>
    </section>
  );
}
