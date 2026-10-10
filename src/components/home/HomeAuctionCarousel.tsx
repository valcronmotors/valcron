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
  const empty = error || auctions.length === 0;

  return (
    <Section className="section-light bg-[#F5F5F5] !py-10 md:!py-14">
      <PageContainer wide>
        <div className="mb-6 flex flex-col items-center gap-2 text-center sm:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            Oportunidades de subasta
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
            Seleccionadas por Valcron
          </h2>
        </div>

        {empty ? (
          <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-5 border border-[#E5E7EB] bg-white px-6 py-8 text-center">
            <p className="max-w-[32rem] text-sm leading-relaxed text-[#3B3B3B]">
              Cuando haya oportunidades publicadas, aparecerán aquí. También puedes pedir una búsqueda.
            </p>
            <Link href="/subastas" className="btn-primary h-11 px-6 text-sm">
              Explorar oportunidades
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
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
            <div className="mt-8 flex justify-center">
              <Link
                href="/subastas"
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
              >
                Explorar oportunidades
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </PageContainer>
    </Section>
  );
}
