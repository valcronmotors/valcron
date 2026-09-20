import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

export function HomeStory() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[28rem] bg-black lg:min-h-[40rem]">
        <EditorialImage
          src={EDITORIAL.cabin.src}
          alt={EDITORIAL.cabin.alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="section-light flex items-center bg-[#faf9f6] px-5 py-20 lg:px-16">
        <div className="max-w-xl">
          <p className="kicker">Nuestra historia</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
            No solo mostramos vehículos.
            <span className="block">Acompañamos decisiones.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#525252]">
            Valcron Motors existe para que encontrar, importar o solicitar un vehículo sea un
            proceso más claro: opciones, costos e información en un mismo lugar.
          </p>
          <Link href="/nosotros" className="btn-primary mt-10">
            Conoce Valcron Motors
          </Link>
        </div>
      </div>
    </section>
  );
}
