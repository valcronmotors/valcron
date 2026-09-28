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
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div className="mb-5 flex items-center justify-between gap-3">
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
            className="border border-[#e4e6ea] bg-[#f7f8fa] px-5 py-8 text-center"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <p className="font-display text-lg font-semibold text-[#08090b]">
              {PUBLIC_INVENTORY_EMPTY.title}
            </p>
            {PUBLIC_INVENTORY_EMPTY.copy ? (
              <p className="mt-2 text-sm text-[#676a70]">{PUBLIC_INVENTORY_EMPTY.copy}</p>
            ) : null}
            <Link href="/solicitar-vehiculo" className="btn-primary mt-5">
              Solicitar vehículo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" compact />
            ))}
          </div>
        )}
      </PageContainer>
    </Section>
  );
}
