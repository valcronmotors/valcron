import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const TOOLS = [
  {
    href: "/financiamiento",
    title: "Calculadora de financiamiento",
    copy: "Explora inicial, plazo y cuota estimada.",
    image: EDITORIAL.documents,
  },
  {
    href: "/importacion",
    title: "Calculadora de importación",
    copy: "Revisa partidas de un costo estimado de llegada.",
    image: EDITORIAL.port,
  },
  {
    href: "/subastas",
    title: "Calculadora de subasta USA",
    copy: "Prepara una estimación antes de pujar o encargar una búsqueda.",
    image: EDITORIAL.yard,
  },
];

export function HomeCalculators() {
  return (
    <section className="bg-[#111111]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="kicker">Herramientas</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Herramientas para planificar mejor.
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group overflow-hidden rounded-[1.5rem] border border-white/10">
              <div className="relative aspect-[16/10]">
                <EditorialImage
                  src={tool.image.src}
                  alt={tool.image.alt}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="bg-[#0a0a0a] p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{tool.title}</h3>
                <p className="mt-3 text-sm text-white/55">{tool.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
