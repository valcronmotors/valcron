import Link from "next/link";
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
    <Section className="section-light bg-white !py-12 md:!py-16" id="inventario">
      <PageContainer>
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
            Explora los vehículos
          </h2>
          <div className="mt-6 flex justify-center gap-8 border-b border-[#e5e5e5]">
            <span className="relative -mb-px pb-3 text-sm font-medium text-[#08090b]">
              Inventario Valcron
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#08090b]" />
            </span>
            <Link href="/subastas" className="pb-3 text-sm font-medium text-[#8a8d91] transition-colors hover:text-[#191919]">
              Subastas
            </Link>
          </div>
        </div>

        {empty ? (
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-[#e5e5e5] bg-[#f7f7f8] px-5 py-6 text-left md:flex-row md:items-center md:px-8">
            <div>
              <p className="font-display text-base font-semibold text-[#08090b] sm:text-lg">
                {PUBLIC_INVENTORY_EMPTY.title}
              </p>
            </div>
            <Link href="/solicitar-vehiculo" className="btn-primary h-11 shrink-0 px-5 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="mt-8 -mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
            <VehicleCarousel speedSeconds={64}>
              {visible.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" compact />
              ))}
            </VehicleCarousel>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/inventario" className="btn-secondary h-11 px-5 text-sm">
            Ver todo el inventario
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
