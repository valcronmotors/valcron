"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { VehicleCard } from "@/components/public/VehicleCard";
import { Reveal } from "@/components/shared/Reveal";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

export function FeaturedInventory({
  initialVehicles,
  error,
}: {
  initialVehicles: PublicVehicle[];
  error: string | null;
}) {
  const [liveVehicles, setLiveVehicles] = useState<PublicVehicle[] | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const vehicles = liveVehicles ?? initialVehicles;
  const loadError = liveError ?? error;

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      try {
        const response = await fetch("/api/public/vehicles", { cache: "no-store" });
        const payload = (await response.json()) as {
          data?: PublicVehicle[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudo actualizar el inventario.");
        }
        setLiveVehicles(payload.data ?? []);
        setLiveError(null);
      } catch (refreshError) {
        setLiveError(
          refreshError instanceof Error
            ? refreshError.message
            : "No se pudo sincronizar el inventario.",
        );
      }
    }

    const channel = supabase
      .channel("home-vehiculos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehiculos" },
        () => {
          void refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const dealerStock = useMemo(
    () =>
      vehicles.filter(
        (vehicle) => vehicle.listingKind === "dealer" && vehicle.availability !== "sold" && vehicle.availability !== "auction",
      ),
    [vehicles],
  );
  const localFirst = dealerStock.length > 0;
  const visible = useMemo(
    () => (localFirst ? dealerStock : vehicles).slice(0, 4),
    [dealerStock, localFirst, vehicles],
  );

  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker">{localFirst ? "Disponibles en RD" : "Inventario"}</p>
              <h2 className="mt-3 max-w-xl text-balance font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
                {localFirst
                  ? "Vehículos disponibles para tu próxima compra."
                  : "Explora las unidades publicadas actualmente."}
              </h2>
            </div>
            <Link href="/inventario" className="btn-secondary shrink-0">
              Ver todo el inventario
            </Link>
          </div>
        </Reveal>

        {loadError ? (
          <p className="mt-10 rounded-2xl border border-[#ececea] bg-[#faf9f6] px-5 py-4 text-sm text-[#525252]">
            {loadError}
          </p>
        ) : visible.length === 0 ? (
          <div className="mt-12">
            <InventoryEmptyState
              tone="light"
              title="Inventario en actualización"
              copy="Escríbenos para localizar el vehículo que buscas."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
