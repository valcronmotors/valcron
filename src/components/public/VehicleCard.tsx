import Link from "next/link";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { displayVehiclePrice, vehicleImageAlt } from "@/lib/vehicles/vehicle-formatters";
import { buildVehicleWhatsAppUrl } from "@/lib/vehicles/vehicle-formatters";
import { formatMileage } from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge, sourceLabel } from "@/lib/vehicles/vehicle-status";
import { vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle } from "@/types/vehicle";

function DetailsCta({ href, light }: { href: string; light: boolean }) {
  return (
    <Link
      href={href}
      className={
        light
          ? "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] bg-[#111111] px-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1c1c1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7A96B]"
          : "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] bg-white px-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7A96B]"
      }
    >
      Ver detalles
      <span aria-hidden className="text-[#C7A96B]">
        →
      </span>
    </Link>
  );
}

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
  const platform = vehicle.source === "stock_rd" ? null : sourceLabel(vehicle.source);
  const light = tone === "light";
  const cover = vehicle.images[0]?.url;

  return (
    <article
      className={`group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        light
          ? "rounded-[1.15rem] border border-[#ececea] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-[#C7A96B]/40"
          : "gloss-panel hover:border-white/28"
      }`}
    >
      <Link href={href} className="relative aspect-[16/10] min-h-[13rem] overflow-hidden bg-[#111]">
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <span
          className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${badge.className}`}
        >
          {badge.label}
        </span>
        {platform ? (
          <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {platform}
          </span>
        ) : null}
      </Link>

      <div className={`flex flex-1 flex-col gap-3 p-5 ${light ? "text-[#111]" : "text-white"}`}>
        <div>
          <p className={`text-xs uppercase tracking-[0.16em] ${light ? "text-[#737373]" : "text-[#a3a3a3]"}`}>
            {vehicle.year}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
            <Link href={href} className="hover:underline">
              {vehicle.make} {vehicle.model}
            </Link>
          </h3>
          {vehicle.trim ? (
            <p className={`mt-1 text-sm ${light ? "text-[#525252]" : "text-[#d4d4d4]"}`}>{vehicle.trim}</p>
          ) : null}
        </div>

        <div>
          <p className={`text-[11px] uppercase tracking-[0.16em] ${light ? "text-[#737373]" : "text-[#a3a3a3]"}`}>
            {price.label}
          </p>
          <p className="mt-1 text-lg font-semibold">{price.primary}</p>
          {price.secondary ? (
            <p className={`mt-0.5 text-xs ${light ? "text-[#737373]" : "text-[#a3a3a3]"}`}>{price.secondary}</p>
          ) : null}
        </div>

        {mileage || vehicle.auction?.lotNumber ? (
          <p className={`text-sm ${light ? "text-[#404040]" : "text-[#d4d4d4]"}`}>
            {[mileage, vehicle.auction?.lotNumber ? `Lote #${vehicle.auction.lotNumber}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}

        <div className="mt-auto grid gap-2 pt-2">
          <DetailsCta href={href} light={light} />
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-[0.9rem] border text-sm ${
                light ? "border-[#ececea] text-[#111]" : "border-white/12 text-[#f5f5f5]"
              }`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
