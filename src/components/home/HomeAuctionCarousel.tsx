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
    <Section className="section-dark bg-[#101114] !py-14 md:!py-20">
      <PageContainer wide>
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
            Oportunidades de Subasta
          </h2>
          <p className="max-w-[34rem] text-sm text-white/70 md:text-base">
            Unidades que Valcron publica desde plataformas de Estados Unidos.
          </p>
          <Link
            href="/subastas"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Explorar oportunidades
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {empty ? (
          <div
            className="mt-2 flex flex-col items-start justify-between gap-4 border border-white/10 bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <p className="max-w-[36rem] text-sm leading-relaxed text-[#3a3d42]">
              Cuando haya oportunidades publicadas, aparecerán en este carrusel. También puedes pedir una búsqueda.
            </p>
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
