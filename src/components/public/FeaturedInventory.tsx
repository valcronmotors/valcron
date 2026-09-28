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
  const visible = (localFirst ? dealerStock : vehicles).slice(0, 6);
  const empty = visible.length === 0 || Boolean(error);

  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">Inventario</p>
            <h2 className="display-section mt-3 max-w-xl text-[#08090b]">Vehículos disponibles</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#676a70]">
              {localFirst
                ? "Unidades publicadas para compra en República Dominicana."
                : "Explora las unidades publicadas actualmente. Si no ves lo que buscas, solicítalo."}
            </p>
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
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
