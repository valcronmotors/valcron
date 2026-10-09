import Link from "next/link";
import { Calculator, MapPin, Search, Warehouse } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const TILES = [
  {
    href: "/solicitar-vehiculo",
    label: "Solicitar vehículo",
    icon: Search,
  },
  {
    href: "/inventario",
    label: "Inventario",
    icon: Warehouse,
  },
  {
    href: "/financiamiento",
    label: "Financiamiento",
    icon: Calculator,
  },
  {
    href: "/contacto",
    label: "Visítanos",
    icon: MapPin,
  },
] as const;

export function HomeBuyGuide() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
          Guía de compra
        </h2>
        <div className="mt-10 grid grid-cols-2 divide-x divide-y divide-[#e5e5e5] border border-[#e5e5e5] md:grid-cols-4 md:divide-y-0">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="flex min-h-[8.5rem] flex-col items-center justify-center gap-3 px-4 py-6 text-center transition-colors hover:bg-[#f7f7f8]"
              >
                <Icon className="h-6 w-6 text-[#08090b]" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm font-medium text-[#191919]">{tile.label}</span>
              </Link>
            );
          })}
        </div>
      </PageContainer>
    </Section>
  );
}
