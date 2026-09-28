import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import type { PublicVehicle } from "@/lib/public-catalog";

export function FeaturedInventory({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  const dealerStock = vehicles.filter(
    (vehicle) =>
      vehicle.listingKind === "dealer" &&
      vehicle.availability !== "sold" &&
      vehicle.availability !== "auction",
  );
  const localFirst = dealerStock.length > 0;
  const visible = (localFirst ? dealerStock : vehicles).slice(0, 6);
  const empty = visible.length === 0 || Boolean(error);

  return (
    <Section className="section-light bg-white !py-8 md:!py-10">
      <PageContainer>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="kicker !text-[#676a70]">Inventario</p>
          <Link
            href="/inventario"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#2b6cff]"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {empty ? (
          <div
            className="border border-[#e4e6ea] bg-[#f7f8fa] px-4 py-4 text-center sm:px-5 sm:py-5"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <p className="font-display text-sm font-semibold text-[#08090b] sm:text-base">
              {PUBLIC_INVENTORY_EMPTY.title}
            </p>
            <p className="mt-1 text-sm text-[#676a70]">¿Buscas algo específico?</p>
            <Link href="/solicitar-vehiculo" className="btn-primary mt-3 h-10 px-4 text-sm">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="-mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--page-gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mx-0 xl:grid xl:grid-cols-3 xl:gap-4 xl:overflow-visible xl:px-0 xl:pb-0">
            {visible.map((vehicle) => (
              <div
                key={vehicle.id}
                className="w-[min(72vw,18.5rem)] shrink-0 snap-start sm:w-[min(46vw,20rem)] xl:w-auto xl:shrink"
              >
                <VehicleCard vehicle={vehicle} tone="light" compact />
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </Section>
  );
}
