import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const CALLOUTS = [
  { href: "/inventario", label: "Vehículos disponibles" },
  { href: "/importacion", label: "Importación" },
  { href: "/subastas", label: "Subastas" },
  { href: "/contacto", label: "Búsqueda personalizada" },
];

export function HomeEditorial() {
  return (
    <section className="bg-[#f5f5f5] text-[#111111]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="kicker text-[#737373]">Quiénes somos</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Una nueva forma
            <span className="block">de comprar tu vehículo.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#525252]">
            Valcron Motors conecta compradores en República Dominicana con vehículos disponibles
            localmente y oportunidades provenientes de Estados Unidos.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#525252]">
            Nuestro objetivo es simplificar la búsqueda, compra e importación mediante orientación,
            información clara y seguimiento durante el proceso.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CALLOUTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#d4d4d4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#262626] hover:border-[#111111]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#111111] sm:aspect-[5/4]">
          <EditorialImage
            src={EDITORIAL.suvNight.src}
            alt={EDITORIAL.suvNight.alt}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
