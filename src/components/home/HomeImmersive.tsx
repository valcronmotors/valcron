import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeImmersive() {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.sedan.src}
        alt={EDITORIAL.sedan.alt}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-end px-5 py-20 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Encuentra algo
            <span className="block">que realmente quieras conducir.</span>
          </h2>
          <Link href="/inventario" className="btn-primary mt-8">
            Buscar vehículo
          </Link>
        </div>
      </div>
    </section>
  );
}
