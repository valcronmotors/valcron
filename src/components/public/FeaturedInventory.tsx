import Link from "next/link";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { PUBLIC_INVENTORY_EMPTY } from "@/lib/admin-copy";
import { VehicleCard } from "@/components/public/VehicleCard";
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
  const visible = (localFirst ? dealerStock : vehicles).slice(0, 4);
  const empty = visible.length === 0 || Boolean(error);

  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">{localFirst ? "Disponibles en Valcron" : "Inventario"}</p>
            <h2 className="mt-2 max-w-xl text-balance font-display text-2xl font-bold tracking-tight text-[#111] md:text-4xl">
              {localFirst
                ? "Vehículos disponibles para tu próxima compra."
                : "Explora las unidades publicadas actualmente."}
            </h2>
          </div>
          <Link href="/inventario" className="btn-secondary shrink-0">
            Ver todo el inventario
          </Link>
        </div>

        {empty ? (
          <div className="mt-12">
            <InventoryEmptyState
              tone="light"
              title={PUBLIC_INVENTORY_EMPTY.title}
              copy={PUBLIC_INVENTORY_EMPTY.copy}
              showRequest
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
