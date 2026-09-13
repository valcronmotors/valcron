"use client";

import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/public/VehicleCard";
import { whatsappHref } from "@/lib/site";
import type { PublicVehicle } from "@/lib/public-catalog";
import { createClient } from "@/utils/supabase/client";

export function LandingInventory({
  initialVehicles,
  error,
}: {
  initialVehicles: PublicVehicle[];
  error: string | null;
}) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [loadError, setLoadError] = useState(error);

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
    <section id="inventario" className="scroll-mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          Inventario en vivo
        </p>
        <h2 className="mt-3 font-display text-4xl text-[#F4F5F7]">Catálogo dinámico</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A909A]">
          Unidades Disponibles en Santo Domingo Este e importaciones por encargo desde
          Copart y Manheim, sincronizadas con Supabase.
        </p>

        {loadError ? (
          <p className="mt-8 rounded-2xl border border-[#FF5500]/30 bg-[#FF5500]/10 px-5 py-4 text-sm text-[#F4F5F7]">
            {loadError}
          </p>
        ) : vehicles.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#D4AF37]/30 bg-[#12141C]/80 p-8 text-center backdrop-blur-xl">
            <p className="text-lg text-[#F4F5F7]">
              No hay vehículos en stock en este momento. ¡Contáctanos para importar el tuyo
              por encargo!
            </p>
            <a
              href={whatsappHref(
                "Hola, no veo stock publicado y quiero importar un vehículo por encargo desde Copart o Manheim.",
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-[#FF5500] px-6 text-sm font-semibold text-white hover:bg-[#ff6a1a]"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
