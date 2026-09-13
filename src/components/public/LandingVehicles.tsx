import Link from "next/link";
import { formatDop, formatUsd } from "@/lib/money";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";

export function LandingVehicles({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  return (
    <section id="catalogo" className="scroll-mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Catálogo dinámico
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Vehículos disponibles ahora
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Inventario de Valcron Motors Group SRL en estado Disponible, sincronizado
              con Supabase. El precio se muestra en DOP y USD.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex h-11 items-center rounded-full bg-white/5 px-5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
          >
            Ver catálogo completo
          </Link>
        </div>

        {error ? (
          <p className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
            {error}
          </p>
        ) : vehicles.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-sm text-slate-400">
            No hay unidades Disponibles publicadas en este momento. Solicita una cotización
            o escríbenos por WhatsApp.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <LandingVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LandingVehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const cover = vehicle.fotosUrls[0];
  const whatsapp = catalogWhatsappHref(vehicle);

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1726] shadow-lg shadow-black/20">
      <div className="relative aspect-[16/10] bg-[#07111f]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={publicVehicleTitle(vehicle)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-slate-500">
            Sin foto
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {vehicle.marca}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {vehicle.modelo} {vehicle.ano}
          </h3>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Marca</dt>
            <dd className="text-slate-100">{vehicle.marca}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Modelo</dt>
            <dd className="text-slate-100">{vehicle.modelo}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Año</dt>
            <dd className="text-slate-100">{vehicle.ano}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Precio</dt>
            <dd className="text-cyan-200">
              {formatDop(vehicle.precioVentaDop)}
              <span className="mt-1 block text-xs text-slate-400">
                {formatUsd(vehicle.precioVentaUsd)}
              </span>
            </dd>
          </div>
        </dl>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Consultar por WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}
