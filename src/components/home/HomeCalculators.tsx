import Link from "next/link";
import { Calculator, Gavel, Ship } from "lucide-react";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";

const TOOLS = [
  {
    href: "/calculadoras/financiamiento",
    title: "Financiamiento",
    copy: "Calcula diferentes escenarios de cuota mensual.",
    image: EDITORIAL.familySedan,
    icon: Calculator,
  },
  {
    href: "/calculadoras/importacion",
    title: "Importación",
    copy: "Organiza los principales costos asociados con importar un vehículo.",
    image: EDITORIAL.compactSuv,
    icon: Ship,
  },
  {
    href: "/calculadoras/subasta",
    title: "Subasta USA",
    copy: "Estima los costos asociados con una compra en subasta.",
    image: EDITORIAL.silverSedan,
    icon: Gavel,
  },
];

export function HomeCalculators() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Herramientas</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Herramientas para
          <span className="block">planificar mejor.</span>
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group overflow-hidden rounded-[1.35rem] border border-[#ececea] bg-[#faf9f6] transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
            >
              <div className="relative aspect-[16/10]">
                <EditorialImage
                  src={tool.image.src}
                  alt={tool.image.alt}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6">
                <tool.icon className="h-5 w-5 text-[#C7A96B]" strokeWidth={1.7} />
                <h3 className="mt-4 font-display text-2xl font-semibold text-[#111]">{tool.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#525252]">{tool.copy}</p>
                <p className="mt-5 text-sm font-semibold text-[#111]">Abrir herramienta</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
