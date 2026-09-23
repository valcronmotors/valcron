"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/public/VehicleCard";
import { whatsappHref } from "@/lib/site";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

export function InventoryEmptyState({
  title = "Sin coincidencias en este momento",
  copy = "No hay unidades que coincidan con tu búsqueda. Un asesor puede ayudarte a encontrar el vehículo que buscas.",
  tone = "dark",
}: {
  title?: string;
  copy?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <div
      className={
        light
          ? "rounded-[1.15rem] border border-black/10 bg-white px-8 py-14 text-center"
          : "gloss-panel px-8 py-14 text-center"
      }
    >
      <p className={`font-display text-2xl ${light ? "text-[#111]" : "text-white"}`}>{title}</p>
      <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${light ? "text-[#404040]" : "text-[#d4d4d4]"}`}>
        {copy}
      </p>
      <a
        href={whatsappHref(
          "Hola, no veo coincidencias en el inventario y quiero que me ayuden a encontrar el vehículo que busco.",
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
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Inventario</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#111] sm:text-5xl">
              Catálogo reciente
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#404040]">
              Unidades disponibles en República Dominicana y opciones en proceso de subasta o
              importación.
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
              tone="light"
              title="Inventario en actualización"
              copy="No hay unidades publicadas en este momento. Escríbenos y te ayudamos a encontrar el vehículo que buscas."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
