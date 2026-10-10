"use client";

import Link from "next/link";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import {
  buildVehicleWhatsAppMessage,
  displayVehiclePrice,
  formatMileage,
  vehicleImageAlt,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge } from "@/lib/vehicles/vehicle-status";
import { vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import { whatsappHref } from "@/lib/site";
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
  const title = [make, model].filter(Boolean).join(" ");
  const trim = (vehicle.trim || "").trim();
  const transmission = (vehicle.transmission || "").trim();
  const metaLine = [mileage, transmission].filter(Boolean).join(" · ");
  const showBadge = Boolean(badge?.label);
  const whatsapp = whatsappHref(buildVehicleWhatsAppMessage(vehicle));

  return (
    <article
      className={`vehicle-card group flex flex-col overflow-hidden ${
        light ? "border border-[#e5e5e5] bg-white" : "gloss-panel"
      }`}
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <Link
        href={href}
        className={`vehicle-card-media relative aspect-[16/10] overflow-hidden ${
          light ? "bg-[#F5F5F5]" : "bg-[#12141a]"
        }`}
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1600px) 20vw, (min-width: 1280px) 24vw, (min-width: 1024px) 31vw, (min-width: 768px) 45vw, 85vw"
          className="object-contain object-center p-3 sm:p-4"
        />
        {showBadge ? (
          <span className="absolute left-3 top-3 rounded-sm bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#191919] ring-1 ring-[#E5E7EB]">
            {badge.label}
          </span>
        ) : null}
      </Link>

      <div
        className={`flex flex-1 flex-col ${compact ? "p-3 sm:p-4" : "px-4 pb-4 pt-3"} ${
          light ? "text-[#08090b]" : "text-white"
        }`}
      >
        {year ? (
          <p className={`text-[12px] ${light ? "text-[#8a8d91]" : "text-white/55"}`}>{year}</p>
        ) : null}
        <h3 className={`font-display font-bold leading-snug tracking-tight ${compact ? "text-base md:text-lg" : "text-lg"}`}>
          <Link href={href}>{title || "Vehículo"}</Link>
        </h3>
        {trim ? (
          <p className={`text-xs ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>{trim}</p>
        ) : null}
        {metaLine ? (
          <p className={`mt-0.5 text-[11px] ${light ? "text-[#8a8d91]" : "text-[#a8abb0]"}`}>{metaLine}</p>
        ) : null}
        {price.primary ? (
          <p className={`mt-2 font-display font-bold tracking-tight ${compact ? "text-base md:text-lg" : "text-lg"}`}>
            {price.primary}
            {price.secondary ? (
              <span className="ml-1 text-[11px] font-medium text-[#8a8d91]">{price.secondary}</span>
            ) : null}
          </p>
        ) : null}
        <div className={`mt-auto grid gap-2 ${compact ? "pt-3" : "pt-4"} sm:grid-cols-2`}>
          <Link
            href={href}
            className={
              light
                ? "inline-flex h-10 items-center justify-center rounded-full bg-[#08090b] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#191919]"
                : "inline-flex h-10 items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-[#08090b] transition-colors hover:bg-[#ececec]"
            }
          >
            {actionLabel ?? "Ver detalles"}
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={
              light
                ? "inline-flex h-10 items-center justify-center rounded-full border border-[#d4d4d4] px-3 text-xs font-semibold text-[#08090b] transition-colors hover:border-[#08090b]"
                : "inline-flex h-10 items-center justify-center rounded-full border border-white/30 px-3 text-xs font-semibold text-white transition-colors hover:border-white"
            }
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
