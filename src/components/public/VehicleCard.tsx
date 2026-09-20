"use client";

import Link from "next/link";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { publicVehicleTitle, type PublicVehicle } from "@/lib/public-catalog";
import { publicListingBadge } from "@/lib/public-status";

export function VehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const { formatAmount, formatSecondary } = useDisplayCurrency();
  const cover = vehicle.fotosUrls[0];
  const badge = publicListingBadge(vehicle);
  const title = publicVehicleTitle(vehicle);
  const href = `/inventario/${vehicle.id}`;
  const specs = [
    { label: "Año", value: String(vehicle.ano) },
    { label: "Versión", value: vehicle.trim },
    { label: "Ubicación", value: vehicle.listingKind === "auction" ? "Subasta USA" : "República Dominicana" },
    { label: "Estado", value: badge.label },
  ].filter((item) => Boolean(item.value));

  return (
    <article className="group gloss-panel flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/28">
      <Link href={href} className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <VehiclePhoto
          src={cover}
          alt={title}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <span
          className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${badge.className}`}
        >
          {badge.label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="kicker">{vehicle.ano}</p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-white">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          {vehicle.trim ? (
            <p className="mt-1 text-sm text-white/50">{vehicle.trim}</p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs">
          {specs.map((item) => (
            <div key={item.label}>
              <dt className="uppercase tracking-[0.14em] text-white/35">{item.label}</dt>
              <dd className="mt-1 text-sm text-white/82">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto">
          <p className="text-lg font-semibold text-white">
            {formatAmount(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
          </p>
          <p className="mt-1 text-xs text-white/40">
            {formatSecondary(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
          </p>
        </div>

        <Link href={href} className="btn-secondary mt-1 w-full">
          Ver detalles
        </Link>
      </div>
    </article>
  );
}
