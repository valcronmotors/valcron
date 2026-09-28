import Link from "next/link";
import { Car, Calculator, Gavel, Search } from "lucide-react";

const ACTIONS = [
  { href: "/inventario", label: "Comprar vehículo", icon: Car },
  { href: "/solicitar-vehiculo", label: "Solicitar vehículo", icon: Search },
  { href: "/financiamiento", label: "Financiamiento", icon: Calculator },
  { href: "/subastas", label: "Subastas", icon: Gavel },
] as const;

export function HomeQuickActions() {
  return (
    <section className="section-light bg-[#f7f5f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h2 className="font-display text-xl font-semibold text-[#141414] md:text-2xl">¿Cómo te ayudamos?</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-[#e6e2db] bg-white p-4 text-[#141414]"
            >
              <action.icon className="h-5 w-5 text-[#9b793f]" strokeWidth={1.7} />
              <span className="mt-3 text-sm font-semibold leading-snug">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
