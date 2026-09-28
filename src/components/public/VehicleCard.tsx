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
  compact = false,
  actionLabel,
}: {
  vehicle: PublicVehicle;
  tone?: "dark" | "light";
  compact?: boolean;
  actionLabel?: string;
}) {
  const { currency } = useDisplayCurrency();
  const badge = publicListingBadge(vehicle);
  const href = vehiclePath(vehicle.slug);
  const price = displayVehiclePrice(vehicle, currency);
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  const light = tone === "light";
  const cover = vehicle.images[0]?.url;
  const year = vehicle.year ?? vehicle.ano;
  const make = (vehicle.make || vehicle.marca || "").trim();
  const model = (vehicle.model || vehicle.modelo || "").trim();
  const title = [year ? String(year) : null, make, model].filter(Boolean).join(" ");
  const trim = (vehicle.trim || "").trim();
  const transmission = (vehicle.transmission || "").trim();
  const metaLine = [mileage, transmission].filter(Boolean).join(" · ");
  const showBadge = Boolean(badge?.label);

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
          light ? "bg-white" : "bg-[#12141a]"
        }`}
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 50vw"
          className="object-contain object-center p-2 sm:p-3"
        />
        {showBadge ? (
          <span
            className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 ${badge.className}`}
          >
            {badge.label}
          </span>
        ) : null}
      </Link>

      <div
        className={`flex flex-1 flex-col gap-1 ${compact ? "p-3 sm:p-4" : "p-4"} ${
          light ? "text-[#08090b]" : "text-white"
        }`}
      >
        <h3
          className={`font-display font-bold leading-snug tracking-tight ${
            compact ? "text-sm sm:text-base md:text-lg" : "text-base md:text-lg"
          }`}
        >
          <Link href={href}>{title || "Vehículo"}</Link>
        </h3>
        {trim ? (
          <p className={`text-xs sm:text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>
            {trim}
          </p>
        ) : null}
        {metaLine ? (
          <p className={`mt-0.5 text-[11px] sm:text-xs ${light ? "text-[#676a70]" : "text-[#a8abb0]"}`}>
            {metaLine}
          </p>
        ) : null}
        {price.primary ? (
          <p
            className={`mt-1.5 font-display font-bold tracking-tight ${
              compact ? "text-base sm:text-lg md:text-xl" : "text-lg md:text-xl"
            }`}
          >
            {price.primary}
          </p>
        ) : null}
        <Link
          href={href}
          className={
            light
              ? "mt-2 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#08090b] px-3 text-xs font-semibold text-white transition-colors duration-180 hover:bg-[#12141a] sm:mt-3 sm:h-11 sm:text-sm"
              : "mt-2 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-[#08090b] transition-colors duration-180 hover:bg-[#ececec] sm:mt-3 sm:h-11 sm:text-sm"
          }
        >
          {actionLabel ?? "Ver detalles"}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
