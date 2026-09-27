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
  const specs = [mileage, vehicle.transmission, vehicle.drivetrain, vehicle.fuelType].filter(Boolean);
  const quoteLabel = publicVehicleCardActionLabel(vehicle);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition duration-200 ${
        light
          ? "border-[#e6e2db] bg-white shadow-[0_10px_28px_rgba(20,20,20,0.05)] hover:border-[#c7a96b]/50"
          : "gloss-panel hover:border-white/28"
      }`}
    >
      <Link href={href} className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
        >
          {badge.label}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col gap-3 p-5 ${light ? "text-[#141414]" : "text-white"}`}>
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">
            <Link href={href} className="hover:underline">
              {vehicleDisplayTitle({ year, make, model, trim: null, ano: year, marca: make, modelo: model })}
            </Link>
          </h3>
          {vehicle.trim ? (
            <p className={`mt-1 text-sm ${light ? "text-[#5c5c5c]" : "text-[#d4d4d4]"}`}>{vehicle.trim}</p>
          ) : null}
        </div>

        {specs.length ? (
          <p className={`text-sm ${light ? "text-[#4a4a4a]" : "text-[#d4d4d4]"}`}>{specs.join(" · ")}</p>
        ) : null}

        <div>
          <p className="text-lg font-semibold">{price.primary}</p>
          {price.secondary ? (
            <p className={`mt-0.5 text-xs ${light ? "text-[#6b6b6b]" : "text-[#a3a3a3]"}`}>{price.secondary}</p>
          ) : null}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Link
            href={href}
            className={
              light
                ? "inline-flex h-11 items-center justify-center rounded-lg bg-[#141414] px-3 text-sm font-semibold text-white hover:bg-[#2a2a2a]"
                : "inline-flex h-11 items-center justify-center rounded-lg bg-white px-3 text-sm font-semibold text-[#111]"
            }
          >
            Ver vehículo
          </Link>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm ${
                light ? "border-[#e6e2db] text-[#141414]" : "border-white/15 text-white"
              }`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              {quoteLabel}
            </a>
          ) : (
            <span />
          )}
        </div>
      </div>
    </article>
  );
}
