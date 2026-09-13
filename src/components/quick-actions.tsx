import Link from "next/link";
import { COMPANY_NAMES } from "@/lib/companies";

export function QuickActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/vehiculos/nuevo"
        className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 transition hover:bg-cyan-400/20"
      >
        <div>
          <p className="text-sm font-semibold text-white">Agregar Vehículo</p>
          <p className="mt-1 text-xs text-slate-400">{COMPANY_NAMES.valcron}</p>
        </div>
        <span className="text-lg text-cyan-300">+</span>
      </Link>
      <Link
        href="/repuestos/nuevo"
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10"
      >
        <div>
          <p className="text-sm font-semibold text-white">Agregar Repuesto</p>
          <p className="mt-1 text-xs text-slate-400">
            {COMPANY_NAMES.partsDirect}
          </p>
        </div>
        <span className="text-lg text-slate-300">+</span>
      </Link>
    </section>
  );
}
