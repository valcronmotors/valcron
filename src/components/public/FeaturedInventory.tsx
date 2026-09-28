import Image from "next/image";
import Link from "next/link";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { EDITORIAL } from "@/lib/editorial-media";
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
  const featured = visible[0];
  const supporting = visible.slice(1, 5);

  return (
    <Section className="section-light bg-white">
      <PageContainer>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="Inventario"
            title="Vehículos disponibles"
            subtitle={
              localFirst
                ? "Unidades publicadas para compra en República Dominicana."
                : "Explora las unidades publicadas. Si no ves lo que buscas, solicítalo."
            }
          />
          <Link href="/inventario" className="btn-secondary shrink-0 self-start lg:self-auto">
            Ver todo el inventario
          </Link>
        </div>

        {empty ? (
          <div className="mt-10 md:mt-12">
            <InventoryEmptyState tone="light" showRequest />
          </div>
        ) : (
          <div className="mt-10 space-y-5 md:mt-12">
            {featured ? (
              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <VehicleCard vehicle={featured} tone="light" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {supporting.slice(0, 2).map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
                  ))}
                </div>
              </div>
            ) : null}
            {supporting.length > 2 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {supporting.slice(2).map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
                ))}
              </div>
            ) : null}
          </div>
        )}

        {empty ? (
          <div
            className="relative mt-6 overflow-hidden"
            style={{ borderRadius: "var(--radius-card)", aspectRatio: "21 / 9" }}
          >
            <Image
              src={EDITORIAL.citySuv.src}
              alt={EDITORIAL.citySuv.alt}
              fill
              sizes="(max-width: 768px) 92vw, 72rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#08090b]/25" />
          </div>
        ) : null}
      </PageContainer>
    </Section>
  );
}
