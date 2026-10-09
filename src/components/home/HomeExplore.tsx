"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { PageContainer, Section } from "@/components/public/layout";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import {
  HOME_VEHICLE_TABS,
  vehicleMatchesHomeTab,
  type HomeVehicleTab,
} from "@/lib/home-vehicle-categories";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import {
  displayVehiclePrice,
  formatMileage,
  vehicleImageAlt,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge } from "@/lib/vehicles/vehicle-status";
import { vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle } from "@/types/vehicle";

function HomeVehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const { currency } = useDisplayCurrency();
  const href = vehiclePath(vehicle.slug);
  const price = displayVehiclePrice(vehicle, currency);
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  const badge = publicListingBadge(vehicle);
  const year = vehicle.year ?? vehicle.ano;
  const make = (vehicle.make || vehicle.marca || "").trim();
  const model = (vehicle.model || vehicle.modelo || "").trim();
  const trim = (vehicle.trim || "").trim();
  const title = [make, model].filter(Boolean).join(" ") || "Vehículo";

  return (
    <article className="flex h-full flex-col bg-white">
      <Link href={href} className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2b6cff]">
        <span className="relative block aspect-[16/10] overflow-hidden bg-[#f4f5f7]">
          <VehiclePhoto
            src={vehicle.images[0]?.url}
            alt={vehicleImageAlt(vehicle)}
            sizes="(max-width: 767px) 82vw, (max-width: 1279px) 46vw, 24vw"
            className="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {badge?.label ? (
            <span className="absolute left-3 top-3 bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#191919]">
              {badge.label}
            </span>
          ) : null}
        </span>
        <span className="flex flex-1 flex-col px-1 pb-1 pt-4">
          {year ? <span className="text-xs text-[#8a8d91]">{year}</span> : null}
          <span className="mt-1 font-display text-lg font-bold tracking-tight text-[#08090b] md:text-xl">
            {title}
          </span>
          {trim ? <span className="mt-0.5 text-sm text-[#676a70]">{trim}</span> : null}
          <span className="mt-3 flex items-end justify-between gap-3">
            <span className="font-display text-base font-bold text-[#08090b]">{price.primary}</span>
            {mileage ? <span className="text-xs text-[#8a8d91]">{mileage}</span> : null}
          </span>
        </span>
      </Link>
    </article>
  );
}

export function HomeExplore({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  const [tab, setTab] = useState<HomeVehicleTab>("all");
  const scroller = useRef<HTMLDivElement>(null);
  const visible = useMemo(
    () => vehicles.filter((vehicle) => vehicleMatchesHomeTab(vehicle, tab)).slice(0, 12),
    [vehicles, tab],
  );

  function scrollByCard(direction: -1 | 1) {
    const root = scroller.current;
    const card = root?.querySelector<HTMLElement>("[data-home-card]");
    if (!root || !card) return;
    const gap = 16;
    root.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  return (
    <Section className="section-light bg-white" id="inventario">
      <PageContainer wide>
        <h2 className="text-center font-display text-[2rem] font-bold tracking-tight text-[#08090b] md:text-5xl">
          Explora los vehículos
        </h2>
        <div
          className="mt-8 flex gap-6 overflow-x-auto border-b border-[#e5e5e5] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Categorías de vehículos"
        >
          {HOME_VEHICLE_TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`relative -mb-px shrink-0 pb-3 text-sm font-medium md:text-base ${
                  selected ? "text-[#08090b]" : "text-[#8a8d91] hover:text-[#191919]"
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
                {selected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#08090b]" /> : null}
              </button>
            );
          })}
        </div>

        {error || visible.length === 0 ? (
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-[#e5e5e5] bg-[#f7f8fa] px-5 py-6 sm:flex-row sm:items-center sm:px-8">
            <p className="font-display text-base font-semibold text-[#08090b] sm:text-lg">
              {error
                ? "No pudimos cargar el inventario."
                : tab === "all"
                  ? PUBLIC_INVENTORY_EMPTY.title
                  : "No hay unidades publicadas en esta categoría."}
            </p>
            <Link href="/solicitar-vehiculo" className="btn-primary h-11 shrink-0 px-5 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="relative mt-8">
            {visible.length > 1 ? (
              <div className="mb-4 hidden justify-end gap-2 md:flex">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white text-[#08090b]"
                  aria-label="Anterior"
                  onClick={() => scrollByCard(-1)}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4e6ea] bg-white text-[#08090b]"
                  aria-label="Siguiente"
                  onClick={() => scrollByCard(1)}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : null}
            <div
              ref={scroller}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visible.map((vehicle) => (
                <div
                  key={vehicle.id}
                  data-home-card
                  className="w-[84%] shrink-0 snap-start sm:w-[72%] md:w-[46%] lg:w-[31%] xl:w-[23.5%]"
                >
                  <HomeVehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/inventario" className="text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline">
            Ver todo el inventario
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
