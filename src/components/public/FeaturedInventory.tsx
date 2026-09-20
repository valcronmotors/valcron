"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
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

  const visible = useMemo(() => vehicles.slice(0, 4), [vehicles]);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker">Inventario</p>
              <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Vehículos que merecen tu atención.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
                Explora una selección de vehículos disponibles y descubre opciones que se adapten a
                tus necesidades.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CurrencySwitch />
              <Link href="/inventario" className="btn-secondary shrink-0">
                Explorar todo el inventario
              </Link>
            </div>
          </div>
        </Reveal>

        {loadError ? (
          <p className="mt-10 rounded-2xl border border-white/10 bg-surface px-5 py-4 text-sm text-muted">
            {loadError}
          </p>
        ) : visible.length === 0 ? (
          <div className="mt-12">
            <InventoryEmptyState
              title="Inventario en actualización"
              copy="Escríbenos para localizar o importar el vehículo que buscas desde Estados Unidos."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
