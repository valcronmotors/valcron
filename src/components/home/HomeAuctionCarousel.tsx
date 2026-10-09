import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
import { filterAuctionCatalogVehicles } from "@/lib/catalogs";
import { AUCTION_SERVICE_COPY } from "@/lib/public-price-mode";
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
  const empty = error || auctions.length === 0;

  return (
    <Section className="section-light bg-[#f7f8fa] !py-8 md:!py-10">
      <PageContainer>
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <p className="kicker !text-[#676a70]">Oportunidades de subasta</p>
          </div>
          <Link
            href="/subastas"
            className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-[#2b6cff]"
          >
            Explorar oportunidades
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {empty ? (
          <div
            className="mt-4 flex flex-col items-start justify-between gap-4 border border-[#e4e6ea] bg-white px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <p className="max-w-[36rem] text-sm leading-relaxed text-[#676a70]">{AUCTION_SERVICE_COPY}</p>
            <Link href="/subastas" className="btn-primary h-11 shrink-0 px-5 text-sm">
              Explorar oportunidades
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
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
        )}
      </PageContainer>
    </Section>
  );
}
