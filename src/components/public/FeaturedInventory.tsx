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
    <Section className="section-light bg-white !py-8 md:!py-10">
      <PageContainer>
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <p className="kicker !text-[#676a70]">Inventario Valcron</p>
          </div>
          <Link
            href="/inventario"
            className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-[#2b6cff]"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {empty ? (
          <div
            className="mt-4 flex flex-col items-start justify-between gap-4 border border-[#e4e6ea] bg-[#f7f8fa] px-5 py-4 text-left sm:px-6 sm:py-5 md:flex-row md:items-center md:px-7 md:py-6"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <div>
              <p className="font-display text-base font-semibold text-[#08090b] sm:text-lg">
                {PUBLIC_INVENTORY_EMPTY.title}
              </p>
              <p className="mt-1 text-sm text-[#676a70]">{PUBLIC_INVENTORY_EMPTY.copy}</p>
            </div>
            <Link href="/solicitar-vehiculo" className="btn-primary h-11 shrink-0 px-5 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="mt-4 -mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
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
