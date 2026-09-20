import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const HIGHLIGHTS = [
  { href: "/inventario", title: "Vehículos", copy: "Explora unidades disponibles." },
  { href: "/importacion", title: "Importación", copy: "Opciones desde Estados Unidos." },
  {
    href: "/subastas",
    title: "Subastas",
    copy: "Acceso a oportunidades disponibles en plataformas estadounidenses.",
  },
];

export function HomeEditorial() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div>
          <p className="kicker">Quiénes somos</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl lg:text-6xl">
            Una mejor forma
            <span className="block">de encontrar tu vehículo.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#525252]">
            Valcron Motors conecta compradores en República Dominicana con vehículos disponibles
            localmente y oportunidades provenientes de Estados Unidos.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#525252]">
            Ya sea que estés buscando un vehículo disponible, una unidad específica o una
            oportunidad en subasta, nuestro objetivo es ayudarte a entender tus opciones y
            acompañarte durante el proceso.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-[#ececea] bg-white p-4 transition hover:border-[#C7A96B]/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[#525252]">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#111] sm:aspect-[5/4]">
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
