import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
import { filterAuctionCatalogVehicles } from "@/lib/catalogs";
import type { PublicVehicle } from "@/lib/public-catalog";

/** Home Oportunidades de Subasta — auction-origin only; never local stock. */
export function HomeAuctionCarousel({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  const auctions = filterAuctionCatalogVehicles(vehicles).slice(0, 8);
  if (error || auctions.length === 0) {
    return null;
  }

  return (
    <Section className="section-light bg-[#f7f7f8] !py-12 md:!py-16">
      <PageContainer>
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-4xl">
            Oportunidades de subasta
          </h2>
          <p className="max-w-[32rem] text-sm text-[#676a70]">
            Más opciones seleccionadas por Valcron en Estados Unidos.
          </p>
          <Link
            href="/subastas"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
          >
            Explorar oportunidades
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 -mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
          <VehicleCarousel speedSeconds={72}>
            {auctions.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                tone="light"
                compact
                actionLabel="Ver oportunidad"
              />
            ))}
          </VehicleCarousel>
        </div>
      </PageContainer>
    </Section>
  );
}
