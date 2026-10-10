import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
import { filterLocalStockVehicles } from "@/lib/catalogs";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { selectFeaturedVehicles } from "@/lib/vehicles/filters";
import type { PublicVehicle } from "@/lib/public-catalog";

/** Home Inventario Valcron — local stock only; never auction-origin. */
export function FeaturedInventory({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  const local = filterLocalStockVehicles(vehicles);
  const featured = selectFeaturedVehicles(local, 8);
  const visible = (featured.length > 0 ? featured : local).slice(0, 8);
  const empty = visible.length === 0 || Boolean(error);

  return (
    <Section className="section-light bg-[#F5F5F5] !py-10 md:!py-14" id="inventario-valcron">
      <PageContainer wide>
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
              Inventario Valcron
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
              Disponibles en República Dominicana
            </h2>
          </div>
          <Link
            href="/inventario"
            className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {empty ? (
          <div className="flex flex-col items-start justify-between gap-4 border border-[#E5E7EB] bg-white px-5 py-5 text-left sm:flex-row sm:items-center sm:px-7">
            <p className="font-display text-base font-semibold text-[#111111] sm:text-lg">
              {PUBLIC_INVENTORY_EMPTY.title}
            </p>
            <Link href="/solicitar-vehiculo" className="btn-primary h-11 shrink-0 px-5 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
            <VehicleCarousel speedSeconds={64}>
              {visible.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" compact />
              ))}
            </VehicleCarousel>
          </div>
        )}
      </PageContainer>
    </Section>
  );
}
