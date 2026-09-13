import { COMPANY_NAMES } from "@/lib/companies";
import { dealerWhatsappHref } from "@/lib/public-catalog";

export function LandingHero() {
  const whatsapp = dealerWhatsappHref(
    "Hola, quiero importar un vehículo desde Copart o Manheim, o consultar un repuesto original.",
  );

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {COMPANY_NAMES.valcron} · {COMPANY_NAMES.partsDirect}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Importa vehículos desde subastas de USA y consigue el repuesto original.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Operamos Copart y Manheim para traer inventario listo a República Dominicana,
            y desde {COMPANY_NAMES.partsDirect} despachamos piezas originales con búsqueda
            por VIN o código.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Escribir por WhatsApp
              </a>
            ) : null}
            <a
              href="#cotizacion"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/5 px-6 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/10"
            >
              Ir al formulario de cotización
            </a>
          </div>
        </div>
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <HeroStat label="Subastas" value="Copart · Manheim" />
          <HeroStat label="Inventario público" value="Solo unidades Disponibles" />
          <HeroStat label="Repuestos" value="Búsqueda por VIN o código" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f]/70 px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
