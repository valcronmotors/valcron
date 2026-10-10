import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
import { filterLocalStockVehicles } from "@/lib/catalogs";
import { selectFeaturedVehicles } from "@/lib/vehicles/filters";
import type { PublicVehicle } from "@/lib/public-catalog";

/**
 * Home Inventario Valcron — local stock only; never auction-origin.
 * When empty: render nothing (no placeholder / empty-state block).
 */
export function FeaturedInventory({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  if (error) return null;

  const local = filterLocalStockVehicles(vehicles);
  const featured = selectFeaturedVehicles(local, 8);
  const visible = (featured.length > 0 ? featured : local).slice(0, 8);
  if (visible.length === 0) return null;

  return (
    <Section className="section-light bg-[#f5f6f7] !py-12 md:!py-16" id="inventario-valcron">
      <PageContainer wide>
        <div className="mb-7 flex flex-col items-center gap-3 text-center sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">
              Inventario Valcron
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
              Nuestros vehículos
            </h2>
          </div>
          <Link
            href="/inventario"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
          >
            Ver inventario
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
          <VehicleCarousel speedSeconds={64}>
            {visible.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                tone="light"
                compact
                actionLabel="Ver detalles"
              />
            ))}
          </VehicleCarousel>
        </div>
      </PageContainer>
    </Section>
  );
}
