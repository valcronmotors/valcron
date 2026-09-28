"use client";

import Link from "next/link";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  buildVehicleWhatsAppUrl,
  displayVehiclePrice,
  formatMileage,
  vehicleDisplayTitle,
  vehicleImageAlt,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge, publicVehicleCardActionLabel } from "@/lib/vehicles/vehicle-status";
import { vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle } from "@/types/vehicle";

export function VehicleCard({
  vehicle,
  tone = "light",
}: {
  vehicle: PublicVehicle;
  tone?: "dark" | "light";
}) {
  const { currency } = useDisplayCurrency();
  const badge = publicListingBadge(vehicle);
  const href = vehiclePath(vehicle.slug);
  const whatsapp = vehicle.availability === "sold" ? null : buildVehicleWhatsAppUrl(vehicle);
  const price = displayVehiclePrice(vehicle, currency);
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  const light = tone === "light";
  const cover = vehicle.images[0]?.url;
  const year = vehicle.year ?? vehicle.ano;
  const make = vehicle.make || vehicle.marca;
  const model = vehicle.model || vehicle.modelo;
  const specLine = [mileage, vehicle.transmission].filter(Boolean).join(" · ");
  const quoteLabel = publicVehicleCardActionLabel(vehicle);

  return (
    <article
      className={`vehicle-card group flex flex-col overflow-hidden ${
        light
          ? "border border-[#e5e3de] bg-white"
          : "gloss-panel"
      }`}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <Link
        href={href}
        className="vehicle-card-media relative aspect-[4/3] overflow-hidden bg-[#1b1d20] sm:aspect-[16/10]"
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className={`absolute left-3 top-3 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          {badge.label}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col gap-1.5 p-4 ${light ? "text-[#111214]" : "text-white"}`}>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          <Link href={href}>
            {vehicleDisplayTitle({ year, make, model, trim: null, ano: year, marca: make, modelo: model })}
          </Link>
        </h3>
        {vehicle.trim ? (
          <p className={`text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>{vehicle.trim}</p>
        ) : null}
        {specLine ? <p className={`text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>{specLine}</p> : null}
        <p className="pt-2 font-display text-xl font-semibold tracking-tight">{price.primary}</p>
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
          <Link
            href={href}
            className={
              light
                ? "inline-flex h-12 items-center justify-center rounded-[0.625rem] bg-[#111214] px-3 text-[0.9375rem] font-semibold text-white transition-colors duration-180 hover:bg-[#1b1d20]"
                : "inline-flex h-12 items-center justify-center rounded-[0.625rem] bg-white px-3 text-[0.9375rem] font-semibold text-[#111214] transition-colors duration-180 hover:bg-[#ececec]"
            }
          >
            Ver detalles
          </Link>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={quoteLabel}
              className={`inline-flex h-12 min-w-12 items-center justify-center gap-1.5 rounded-[0.625rem] border px-3 text-[0.9375rem] transition-colors duration-180 ${
                light
                  ? "border-[#e5e3de] text-[#111214] hover:border-[#111214]"
                  : "border-white/15 text-white hover:border-white/40"
              }`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{quoteLabel}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
