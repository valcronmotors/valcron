"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/public/VehicleCard";
import { whatsappHref } from "@/lib/site";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

export function InventoryEmptyState({
  title = "Sin coincidencias en este momento",
  copy = "No hay unidades que coincidan con tu búsqueda. Un asesor puede localizar o importar el vehículo que buscas.",
}: {
  title?: string;
  copy?: string;
}) {
  return (
    <div className="gloss-panel px-8 py-14 text-center">
      <p className="font-display text-2xl text-foreground">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">{copy}</p>
      <a
        href={whatsappHref(
          "Hola, no veo coincidencias en el inventario y quiero importar un vehículo por encargo con Valcron Motors.",
        )}
        target="_blank"
        rel="noreferrer"
        className="btn-whatsapp mt-6"
      >
        Consultar por WhatsApp
      </a>
    </div>
  );
}

export function LandingInventory({
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
        setLiveVehicles((payload.data ?? []).slice(0, 6));
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
      .channel("landing-vehiculos")
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

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Inventario</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Catálogo reciente
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Unidades en República Dominicana y en subasta Copart/Manheim, sincronizadas en
              tiempo real desde la tabla vehiculos.
            </p>
          </div>
          <Link
            href="/inventario"
            className="btn-secondary shrink-0"
          >
            Ver inventario completo
          </Link>
        </div>

        {loadError ? (
          <p className="mt-10 gloss-panel px-5 py-4 text-sm text-muted">
            {loadError}
          </p>
        ) : vehicles.length === 0 ? (
          <div className="mt-12">
            <InventoryEmptyState
              title="Inventario en actualización"
              copy="No hay unidades publicadas en este momento. Escríbenos para importar por encargo desde Copart o Manheim."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
