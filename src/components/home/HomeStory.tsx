import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const POINTS = [
  "Búsqueda",
  "Análisis de opciones",
  "Costos",
  "Proceso",
  "Comunicación",
  "Entrega",
];

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
      <div className="flex items-center bg-[#111111] px-5 py-20 lg:px-16">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            No solo importamos vehículos.
            <span className="block">Simplificamos decisiones.</span>
          </h2>
          <ul className="mt-8 grid gap-3 text-sm text-white/60">
            {POINTS.map((item) => (
              <li key={item} className="border-b border-white/10 pb-3 uppercase tracking-[0.16em]">
                {item}
              </li>
            ))}
          </ul>
          <Link href="/nosotros" className="btn-primary mt-10">
            Conoce Valcron Motors
          </Link>
        </div>
      </div>
    </section>
  );
}
