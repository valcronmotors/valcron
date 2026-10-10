import Link from "next/link";
import { CarFront, Gavel, Landmark, Search } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const TOOLS = [
  { href: "/inventario", label: "Ver inventario", icon: CarFront },
  { href: "/solicitar-vehiculo", label: "Solicitar vehículo", icon: Search },
  { href: "/financiamiento", label: "Financiamiento", icon: Landmark },
  { href: "/subastas", label: "Explorar subastas", icon: Gavel },
] as const;

/** Compact buying tools — one strip, short labels, no duplicated essays. */
export function HomeBuyGuide() {
  return (
    <Section className="section-light bg-[#F5F5F5]" tight>
      <PageContainer wide>
        <div className="mx-auto max-w-[36rem] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            Herramientas de compra
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
            Elige cómo avanzar
          </h2>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="flex min-h-[8.25rem] flex-col items-center justify-center gap-3 border border-[#E5E7EB] bg-white px-4 py-6 text-center transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#111111]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                >
                  <Icon className="h-7 w-7 text-[#111111]" strokeWidth={1.35} aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#111111] md:text-base">{tool.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </Section>
  );
}
