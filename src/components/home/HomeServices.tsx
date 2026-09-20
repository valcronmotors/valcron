import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const SERVICES = [
  {
    step: "01",
    title: "Vehículos disponibles",
    copy: "Explora nuestro inventario.",
    href: "/inventario",
    image: EDITORIAL.muscle,
  },
  {
    step: "02",
    title: "Subastas USA",
    copy: "Localizamos oportunidades en plataformas de subastas.",
    href: "/subastas",
    image: EDITORIAL.yard,
  },
  {
    step: "03",
    title: "Importación",
    copy: "Coordinación del proceso desde EE.UU. hasta RD.",
    href: "/importacion",
    image: EDITORIAL.port,
  },
  {
    step: "04",
    title: "Búsqueda personalizada",
    copy: "Dinos qué vehículo estás buscando.",
    href: "/contacto",
    image: EDITORIAL.headlights,
  },
  {
    step: "05",
    title: "Financiamiento",
    copy: "Explora escenarios de financiamiento.",
    href: "/financiamiento",
    image: EDITORIAL.documents,
  },
  {
    step: "06",
    title: "Asesoría",
    copy: "Orientación personalizada durante el proceso.",
    href: "/servicios",
    image: EDITORIAL.cabin,
  },
];

export function HomeServices() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="kicker">Servicios</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Todo lo que necesitas.
          <span className="block">En un solo lugar.</span>
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <Link key={service.step} href={service.href} className="group relative isolate min-h-[22rem] overflow-hidden rounded-[1.5rem]">
              <EditorialImage
                src={service.image.src}
                alt={service.image.alt}
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="kicker text-white/50">{service.step}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-white/65">{service.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
