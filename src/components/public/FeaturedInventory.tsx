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
    <Section className="section-light bg-white !py-10 md:!py-14" id="inventario-valcron">
      <PageContainer wide>
        <div className="mb-6 flex flex-col items-center gap-2 text-center sm:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            Inventario Valcron
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
            Disponibles en República Dominicana
          </h2>
        </div>

        {empty ? (
          <div className="mx-auto flex max-w-[36rem] flex-col items-center gap-5 border border-[#E5E7EB] bg-[#F5F5F5] px-6 py-8 text-center">
            <p className="font-display text-base font-semibold text-[#111111] sm:text-lg">
              {PUBLIC_INVENTORY_EMPTY.title}
            </p>
            <Link href="/solicitar-vehiculo" className="btn-primary h-11 px-6 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
              <VehicleCarousel speedSeconds={64}>
                {visible.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" compact />
                ))}
              </VehicleCarousel>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/inventario"
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </PageContainer>
    </Section>
  );
}
