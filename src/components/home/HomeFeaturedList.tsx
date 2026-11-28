import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { filterAuctionCatalogVehicles } from "@/lib/catalogs";
import {
  displayVehiclePrice,
  formatPublicVehicleModel,
  vehicleImageAlt,
} from "@/lib/vehicles/vehicle-formatters";
import { vehiclePath } from "@/lib/vehicles/vehicle-slugs";
import type { PublicVehicle } from "@/types/vehicle";

/**
 * Home — Inventario destacado (orden de Gabriel, 2026-11-27): lista limpia
 * estilo Deluxe, 12 vehículos de subasta en 3 columnas × 4 filas, tarjeta
 * simple con foto, nombre, precio solo (sin etiqueta) y «Ver detalles».
 */
export function HomeFeaturedList({
  vehicles,
  error,
}: {
  vehicles: PublicVehicle[];
  error: string | null;
}) {
  if (error) return null;
  const items = filterAuctionCatalogVehicles(vehicles).slice(0, 12);
  if (items.length === 0) return null;

  return (
    <Section className="section-light bg-white !py-12 md:!py-16" id="inventario-destacado">
      <PageContainer wide>
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
            Inventario destacado
          </h2>
          <p className="mt-2 text-sm text-[#676a70] md:text-base">
            Oportunidades de subasta seleccionadas por Valcron.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((vehicle) => (
            <FeaturedCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/subastas"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#08090b] px-8 text-sm font-semibold text-white transition hover:bg-[#191919]"
          >
            Ver todas las subastas
          </Link>
          <p className="mt-4 text-sm text-[#676a70]">
            ¿Buscas un vehículo ya en el país?{" "}
            <Link
              href="/inventario"
              className="font-semibold text-[#111111] underline-offset-4 hover:underline"
            >
              Ver inventario local
            </Link>
          </p>
        </div>
      </PageContainer>
    </Section>
  );
}

function FeaturedCard({ vehicle }: { vehicle: PublicVehicle }) {
  const price = displayVehiclePrice(vehicle, "USD");
  const year = vehicle.year ?? vehicle.ano;
  const make = (vehicle.make || vehicle.marca || "").trim();
  const model = formatPublicVehicleModel(vehicle.model || vehicle.modelo);
  const trim = (vehicle.trim || "").trim();
  const title = [year, make, model, trim].filter(Boolean).join(" ");
  const href = vehiclePath(vehicle.slug);
  const cover = vehicle.images[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e8eaed] bg-white shadow-[0_8px_28px_rgba(8,9,11,0.05)]">
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden bg-[#f3f4f6]"
        aria-label={`Ver detalles de ${title || "este vehículo"}`}
      >
        <VehiclePhoto
          src={cover}
          alt={vehicleImageAlt(vehicle)}
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 96vw"
          className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold tracking-tight text-[#111111]">
            {title || "Vehículo"}
          </h3>
          {price.primary ? (
            <p className="mt-0.5 font-display text-xl font-bold tracking-tight text-[#111111]">
              {price.primary}
            </p>
          ) : null}
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
        >
          Ver detalles
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
