"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import {
  displayVehiclePrice,
  formatMileage,
  vehicleImageAlt,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge } from "@/lib/vehicles/vehicle-status";
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
  const price = displayVehiclePrice(vehicle, currency);
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  const light = tone === "light";
  const cover = vehicle.images[0]?.url;
  const year = vehicle.year ?? vehicle.ano;
  const make = vehicle.make || vehicle.marca;
  const model = vehicle.model || vehicle.modelo;
  const title = [make, model].filter(Boolean).join(" ");
  const trimLine = [vehicle.trim, vehicle.drivetrain].filter(Boolean).join(" · ");

  return (
    <article
      className={`vehicle-card group flex flex-col overflow-hidden ${
        light ? "border border-[#e4e6ea] bg-white" : "gloss-panel"
      }`}
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <Link
        href={href}
        className={`vehicle-card-media relative aspect-[4/3] overflow-hidden ${
          light ? "bg-[#f7f8fa]" : "bg-[#12141a]"
        }`}
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain object-center p-3"
        />
        {year ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#08090b] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
            {year}
          </span>
        ) : (
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </Link>

      <div className={`flex flex-1 flex-col gap-1 p-4 ${light ? "text-[#08090b]" : "text-white"}`}>
        <h3 className="font-display text-base font-bold leading-snug tracking-tight md:text-lg">
          <Link href={href}>{title || "Vehículo"}</Link>
        </h3>
        {trimLine ? (
          <p className={`text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>{trimLine}</p>
        ) : null}
        {(mileage || vehicle.transmission) && (
          <p className={`mt-1 text-xs ${light ? "text-[#676a70]" : "text-[#a8abb0]"}`}>
            {[mileage, vehicle.transmission].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-2 font-display text-lg font-bold tracking-tight md:text-xl">{price.primary}</p>
        <Link
          href={href}
          className={
            light
              ? "mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#08090b] px-3 text-sm font-semibold text-white transition-colors duration-180 hover:bg-[#12141a]"
              : "mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold text-[#08090b] transition-colors duration-180 hover:bg-[#ececec]"
          }
        >
          Ver detalles
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
