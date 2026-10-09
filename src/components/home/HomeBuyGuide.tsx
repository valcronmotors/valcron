import Link from "next/link";
import { CarFront, Gavel, Landmark, Search } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const TOOLS = [
  { href: "/inventario", label: "Ver inventario", icon: CarFront },
  { href: "/solicitar-vehiculo", label: "Solicitar vehículo", icon: Search },
  { href: "/financiamiento", label: "Financiamiento", icon: Landmark },
  { href: "/subastas", label: "Explorar subastas", icon: Gavel },
] as const;

export function HomeBuyGuide() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer wide>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
          Tu compra, más sencilla.
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="flex min-h-[8.5rem] flex-col items-center justify-center gap-3 bg-white px-4 py-6 text-center transition-colors hover:bg-[#eef0f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]"
                >
                  <Icon className="h-7 w-7 text-[#08090b]" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#191919] md:text-base">{tool.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </Section>
  );
}
