"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { InventoryEmptyState } from "@/components/public/LandingInventory";
import { VehicleCard } from "@/components/public/VehicleCard";
import type { PublicVehicle } from "@/lib/public-catalog";
import { isEcoVehicle } from "@/lib/public-filters";
import { createClient } from "@/utils/supabase/client";

type ShowcaseTab = "arrivals" | "auctions" | "eco";

const TABS: { id: ShowcaseTab; label: string }[] = [
  { id: "arrivals", label: "Recién Llegados a RD" },
  { id: "auctions", label: "Próximas Subastas USA" },
  { id: "eco", label: "Híbridos / Eléctricos (Ley 103-13)" },
];

export function FeaturedInventory({
  initialVehicles,
  error,
}: {
  initialVehicles: PublicVehicle[];
  error: string | null;
}) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [loadError, setLoadError] = useState(error);
  const [tab, setTab] = useState<ShowcaseTab>("arrivals");

  useEffect(() => {
    setVehicles(initialVehicles);
    setLoadError(error);
  }, [error, initialVehicles]);

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
        setVehicles(payload.data ?? []);
        setLoadError(null);
      } catch (refreshError) {
        setLoadError(
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

  const visible = useMemo(() => {
    if (tab === "auctions") {
      return vehicles.filter((vehicle) => vehicle.listingKind === "auction").slice(0, 6);
    }
    if (tab === "eco") {
      return vehicles.filter(isEcoVehicle).slice(0, 6);
    }
    const arrivals = vehicles.filter((vehicle) => vehicle.listingKind === "dealer");
    return (arrivals.length > 0 ? arrivals : vehicles).slice(0, 6);
  }, [tab, vehicles]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">Inventario vivo</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Vehículos destacados
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Sincronizado en tiempo real con la tabla vehiculos. Stock en Santo Domingo y pujas
              activas en Copart y Manheim.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CurrencySwitch />
            <Link href="/inventario" className="btn-secondary shrink-0">
              Ver inventario completo
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`h-10 rounded-full px-4 text-sm transition ${
                  active
                    ? "bg-foreground text-white"
                    : "border border-line text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {loadError ? (
          <p className="mt-10 rounded-2xl border border-line bg-surface px-5 py-4 text-sm text-muted">
            {loadError}
          </p>
        ) : visible.length === 0 ? (
          <div className="mt-12">
            <InventoryEmptyState
              title={
                tab === "eco"
                  ? "Sin unidades eco publicadas"
                  : tab === "auctions"
                    ? "Sin subastas publicadas"
                    : "Inventario en actualización"
              }
              copy={
                tab === "eco"
                  ? "Podemos localizar híbridos y eléctricos con asesoría Ley 103-13 e importarlos por encargo."
                  : "Escríbenos para importar la unidad que buscas desde Copart o Manheim."
              }
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
