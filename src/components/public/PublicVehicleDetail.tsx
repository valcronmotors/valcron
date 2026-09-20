"use client";

import Link from "next/link";
import { useState } from "react";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  catalogWhatsappHref,
  publicVehicleTitle,
  type PublicVehicle,
} from "@/lib/public-catalog";
import { publicListingBadge } from "@/lib/public-status";

export function PublicVehicleDetail({ vehicle }: { vehicle: PublicVehicle }) {
  const { formatAmount, formatSecondary } = useDisplayCurrency();
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = vehicle.fotosUrls;
  const cover = photos[photoIndex] ?? photos[0];
  const title = publicVehicleTitle(vehicle);
  const badge = publicListingBadge(vehicle);
  const whatsapp = catalogWhatsappHref(vehicle);
  const specs = [
    { label: "Año", value: String(vehicle.ano) },
    { label: "Marca", value: vehicle.marca },
    { label: "Modelo", value: vehicle.modelo },
    { label: "Versión", value: vehicle.trim },
    { label: "Estado", value: badge.label },
    { label: "Ubicación", value: vehicle.ubicacion },
    { label: "VIN", value: vehicle.vin },
  ].filter((item) => Boolean(item.value));

  return (
    <article className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-surface-2">
          <VehiclePhoto
            src={cover}
            alt={title}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        {photos.length > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {photos.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setPhotoIndex(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg border ${
                  photoIndex === index ? "border-white/70" : "border-white/10"
                }`}
              >
                <VehiclePhoto src={src} alt="" className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="kicker">{badge.label}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
          {vehicle.marca} {vehicle.modelo}
        </h1>
        <p className="mt-2 text-[#d4d4d4]">
          {vehicle.ano}
          {vehicle.trim ? ` · ${vehicle.trim}` : ""}
        </p>
        <p className="mt-8 font-display text-3xl text-white">
          {formatAmount(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
        </p>
        <p className="mt-1 text-sm text-[#a3a3a3]">
          {formatSecondary(vehicle.precioVentaUsd, vehicle.precioVentaDop)}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-4">
          {specs.map((item) => (
            <div key={item.label} className="border-t border-white/10 pt-3">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-[#a3a3a3]">{item.label}</dt>
              <dd className="mt-1 text-sm text-[#f5f5f5]">{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
              Consultar este vehículo
            </a>
          ) : null}
          <Link href="/inventario" className="btn-secondary">
            Volver al inventario
          </Link>
        </div>
      </div>
    </article>
  );
}
