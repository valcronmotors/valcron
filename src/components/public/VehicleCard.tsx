"use client";

import Link from "next/link";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  buildVehicleWhatsAppUrl,
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
  const title = [make, model].filter(Boolean).join(" ");
  const trim = (vehicle.trim || "").trim();
  const transmission = (vehicle.transmission || "").trim();
  const fuel = (vehicle.fuelType || "").trim();
  const drivetrain = (vehicle.drivetrain || "").trim();
  const specs = [mileage, transmission, drivetrain || fuel].filter(Boolean).slice(0, 3);
  const showBadge = Boolean(badge?.label);
  const whatsapp = buildVehicleWhatsAppUrl(vehicle);
  const primaryLabel = actionLabel ?? "Ver detalles";

  return (
    <article
      className={`vehicle-card group flex h-full flex-col overflow-hidden ${
        light
          ? "border border-[#e8eaed] bg-white shadow-[0_8px_28px_rgba(8,9,11,0.04)]"
          : "gloss-panel"
      }`}
      style={{ borderRadius: "1rem" }}
    >
      <Link
        href={href}
        className={`vehicle-card-media relative block aspect-[16/10] overflow-hidden ${
          light ? "bg-[#f3f4f6]" : "bg-[#12141a]"
        }`}
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1600px) 20vw, (min-width: 1280px) 24vw, (min-width: 1024px) 31vw, (min-width: 768px) 45vw, 92vw"
          className="object-contain object-center"
        />
        {showBadge ? (
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
              light
                ? "bg-white/95 text-[#111111] shadow-sm ring-1 ring-black/5"
                : "bg-black/55 text-white"
            }`}
          >
            {badge.label}
          </span>
        ) : null}
      </Link>

      <div
        className={`flex flex-1 flex-col text-center ${compact ? "px-4 pb-4 pt-4" : "px-5 pb-5 pt-5"} ${
          light ? "text-[#08090b]" : "text-white"
        }`}
      >
        {year ? (
          <p
            className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
              light ? "text-[#8a8d91]" : "text-white/55"
            }`}
          >
            {year}
          </p>
        ) : null}

        <h3
          className={`mt-1 font-display font-bold leading-[1.15] tracking-tight ${
            compact ? "text-[1.15rem] sm:text-xl" : "text-xl sm:text-[1.35rem]"
          }`}
        >
          <Link href={href} className="transition-opacity hover:opacity-80">
            {title || "Vehículo"}
          </Link>
        </h3>

        {trim ? (
          <p className={`mt-1 text-sm ${light ? "text-[#676a70]" : "text-[#d4d4d4]"}`}>{trim}</p>
        ) : null}

        {price.primary ? (
          <div className="mt-3">
            <p
              className={`font-display font-bold tracking-tight ${
                compact ? "text-xl sm:text-2xl" : "text-2xl"
              }`}
            >
              {price.primary}
            </p>
            {price.secondary ? (
              <p className={`mt-0.5 text-xs ${light ? "text-[#8a8d91]" : "text-white/55"}`}>
                {price.secondary}
              </p>
            ) : null}
          </div>
        ) : null}

        {specs.length ? (
          <p
            className={`mt-3 text-[11px] leading-5 ${light ? "text-[#8a8d91]" : "text-[#a8abb0]"}`}
          >
            {specs.join(" · ")}
          </p>
        ) : null}

        <div className={`mt-auto grid gap-2.5 ${compact ? "pt-4" : "pt-5"}`}>
          <Link
            href={href}
            className={
              light
                ? "inline-flex min-h-12 items-center justify-center rounded-xl bg-[#08090b] px-4 text-sm font-semibold text-white transition hover:bg-[#191919]"
                : "inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-[#08090b] transition hover:bg-[#ececec]"
            }
          >
            {primaryLabel}
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={
              light
                ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8dbe0] bg-white px-4 text-sm font-semibold text-[#08090b] transition hover:border-[#08090b]"
                : "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-semibold text-white transition hover:border-white"
            }
          >
            <WhatsAppIcon className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
