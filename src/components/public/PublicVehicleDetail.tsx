"use client";

import Link from "next/link";
import { useState } from "react";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  buildVehicleWhatsAppUrl,
  vehicleDisplayTitle,
  vehicleImageAlt,
  vehiclePublicPriceBlocks,
  visibleVehicleSpecs,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge, sourceLabel } from "@/lib/vehicles/vehicle-status";
import type { PublicVehicle } from "@/types/vehicle";

export function PublicVehicleDetail({
  vehicle,
  similar = [],
}: {
  vehicle: PublicVehicle;
  similar?: PublicVehicle[];
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = vehicle.images.length
    ? vehicle.images.map((image, index) => ({
        url: image.url,
        alt: image.alt || vehicleImageAlt(vehicle, index),
      }))
    : vehicle.fotosUrls.map((url, index) => ({ url, alt: vehicleImageAlt(vehicle, index) }));
  const safeIndex = photos.length ? Math.min(photoIndex, photos.length - 1) : 0;
  const cover = photos[safeIndex];
  const title = vehicleDisplayTitle(vehicle);
  const badge = publicListingBadge(vehicle);
  const whatsapp = buildVehicleWhatsAppUrl(vehicle);
  const specs = visibleVehicleSpecs(vehicle);
  const prices = vehiclePublicPriceBlocks(vehicle);
  const platform =
    vehicle.source === "copart" || vehicle.source === "iaai" || vehicle.source === "manheim"
      ? sourceLabel(vehicle.source)
      : null;
  const features = (vehicle.features ?? []).map((item) => item.trim()).filter(Boolean);
  const description = vehicle.description?.trim() || null;
  const sold = vehicle.availability === "sold";

  return (
    <article className="section-light bg-[#faf9f6] text-[#111]">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <nav aria-label="Migas de pan" className="text-sm text-[#737373]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#111]">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/inventario" className="hover:text-[#111]">
                Inventario
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#111]">{title}</li>
          </ol>
        </nav>

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0">
            <div className="relative aspect-[16/10] min-h-[13rem] overflow-hidden rounded-2xl border border-[#ececea] bg-[#111]">
              <VehiclePhoto
                src={cover?.url}
                alt={cover?.alt ?? title}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            {photos.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {photos.map((photo, index) => (
                  <button
                    key={`${photo.url}-${index}`}
                    type="button"
                    onClick={() => setPhotoIndex(index)}
                    className={`relative aspect-[4/3] min-h-[4.5rem] cursor-pointer overflow-hidden rounded-lg border ${
                      safeIndex === index ? "border-[#111]" : "border-[#ececea]"
                    }`}
                  >
                    <VehiclePhoto src={photo.url} alt="" className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="kicker">{badge.label}</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111]">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-2 text-[#525252]">
              {[vehicle.year || null, vehicle.trim || null, platform].filter(Boolean).join(" · ")}
            </p>

            {sold ? (
              <p className="mt-6 rounded-2xl border border-[#ececea] bg-white px-4 py-3 text-sm text-[#525252]">
                Esta unidad figura como vendida. Conservamos la ficha para consulta. Si buscas algo similar,
                revisa el inventario o escríbenos por WhatsApp.
              </p>
            ) : null}

            <div className="mt-8 grid gap-4">
              {prices.map((block) => (
                <div key={`${block.kind}-${block.label}`} className="border-t border-[#ececea] pt-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#737373]">{block.label}</p>
                  <p className="mt-1 font-display text-3xl text-[#111]">{block.primary}</p>
                  {block.secondary ? <p className="mt-1 text-sm text-[#737373]">{block.secondary}</p> : null}
                  {block.note ? <p className="mt-2 text-sm leading-relaxed text-[#525252]">{block.note}</p> : null}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {!sold ? (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <WhatsAppIcon className="h-4 w-4" />
                  Consultar este vehículo
                </a>
              ) : (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <WhatsAppIcon className="h-4 w-4" />
                  Buscar uno similar
                </a>
              )}
              <Link
                href="/inventario"
                className="inline-flex h-11 items-center justify-center rounded-[0.9rem] border border-[#111] px-5 text-sm font-semibold text-[#111] hover:bg-[#111] hover:text-white"
              >
                Volver al inventario
              </Link>
            </div>
          </div>
        </div>

        {specs.length ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-[#111]">Ficha del vehículo</h2>
            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#ececea] bg-white p-4">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-[#737373]">{item.label}</dt>
                  <dd className="mt-1 break-words text-sm text-[#111]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {description ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#111]">Descripción</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#404040]">{description}</p>
          </section>
        ) : null}

        {features.length ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#111]">Características</h2>
            <ul className="mt-4 grid gap-2 text-sm text-[#404040]">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {similar.length ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-[#111]">Vehículos similares</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
