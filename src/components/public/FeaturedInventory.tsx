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
    <Section className="section-light bg-[#F5F5F5] !py-10 md:!py-14" id="inventario-valcron">
      <PageContainer wide>
        <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
            Nuestros vehículos
          </h2>
          <Link
            href="/inventario"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
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
