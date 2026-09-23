import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";

const TRADE_IN_WHATSAPP = whatsappHref(
  "Hola, tengo un vehículo actual y quiero consultar las opciones disponibles dentro de mi proceso de compra con Valcron Motors.",
);

const CATEGORIES = [
  {
    href: "/inventario?listing=dealer",
    title: "Disponibles en RD",
    copy: "Unidades publicadas para compra local, cuando el inventario lo confirma.",
    image: EDITORIAL.crossover,
  },
  {
    href: "/solicitar-vehiculo",
    title: "Búsqueda personalizada",
    copy: "Dinos marca, modelo, año y presupuesto. Exploramos opciones a tu medida.",
    image: EDITORIAL.compactSuv,
  },
  {
    href: TRADE_IN_WHATSAPP,
    external: true,
    title: "¿Tienes un vehículo actual?",
    copy: "Cuéntanos sobre tu unidad y consulta las opciones disponibles. No es una tasación instantánea.",
    image: EDITORIAL.silverSedan,
  },
];

export function HomeShopBy() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Elige cómo empezar</p>
        <h2 className="mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Encuentra el camino hacia tu próximo vehículo.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525252]">
          Inventario local, una búsqueda a tu medida o consulta sobre tu vehículo actual.
        </p>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {CATEGORIES.map((item) => {
            const className =
              "group overflow-hidden rounded-[1.35rem] bg-[#111] transition hover:-translate-y-1";
            const body = (
              <div className="relative aspect-[4/5]">
                <EditorialImage
                  src={item.image.src}
                  alt={item.image.alt}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/72">{item.copy}</p>
                </div>
              </div>
            );
            if ("external" in item && item.external) {
              return (
                <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className={className}>
                  {body}
                </a>
              );
            }
            return (
              <Link key={item.title} href={item.href} className={className}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
