"use client";

import Link from "next/link";
import { CurrencySwitch, useDisplayCurrency } from "@/components/public/CurrencyProvider";
import { QuoteForm } from "@/components/public/QuoteForm";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleGallery } from "@/components/public/VehicleGallery";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  buildVehicleWhatsAppUrl,
  displayVehiclePrice,
  formatMileage,
  vehicleDisplayTitle,
  vehicleImageAlt,
  visibleVehicleSpecs,
} from "@/lib/vehicles/vehicle-formatters";
import { publicListingBadge, publicVehicleInquiryLabel } from "@/lib/vehicles/vehicle-status";
import {
  AUCTION_QUOTE_PREFILL,
  AUCTION_SERVICE_COPY,
  auctionPublicPriceDisclaimer,
} from "@/lib/public-price-mode";
import type { PublicVehicle } from "@/types/vehicle";

export function PublicVehicleDetail({
  vehicle,
  similar = [],
}: {
  vehicle: PublicVehicle;
  similar?: PublicVehicle[];
}) {
  const { currency } = useDisplayCurrency();
  const photos = vehicle.images.length
    ? vehicle.images.map((image, index) => ({
        url: image.url,
        alt: image.alt || vehicleImageAlt(vehicle, index),
      }))
    : vehicle.fotosUrls.map((url, index) => ({ url, alt: vehicleImageAlt(vehicle, index) }));
  const title = vehicleDisplayTitle(vehicle);
  const badge = publicListingBadge(vehicle);
  const whatsapp = buildVehicleWhatsAppUrl(vehicle);
  const specs = visibleVehicleSpecs(vehicle);
  const price = displayVehiclePrice(vehicle, currency);
  const features = (vehicle.features ?? []).map((item) => item.trim()).filter(Boolean);
  const description = vehicle.description?.trim() || null;
  const sold = vehicle.availability === "sold";
  const year = vehicle.year || vehicle.ano;
  const make = vehicle.make || vehicle.marca;
  const model = vehicle.model || vehicle.modelo;
  const mileage = formatMileage(vehicle.mileage, vehicle.mileageUnit);
  const financeAmount = Math.round(vehicle.pricing.usdPrice || vehicle.precioVentaUsd || 0);
  const dealer = vehicle.listingKind === "dealer";
  const auctionListing = vehicle.listingKind === "auction" || vehicle.availability === "auction";
  const priceMode = vehicle.pricing.publicPriceMode ?? (auctionListing ? "contact" : "fixed");
  const priceNote = auctionListing ? auctionPublicPriceDisclaimer(priceMode) : null;
  const canFinance = !sold && financeAmount > 0 && dealer;
  const primaryCta = publicVehicleInquiryLabel(vehicle);
  const highlightSpecs = [
    { label: "Kilometraje", value: mileage },
    { label: "Transmisión", value: vehicle.transmission?.trim() || null },
    { label: "Tracción", value: vehicle.drivetrain?.trim() || null },
    { label: "Combustible", value: vehicle.fuelType?.trim() || null },
    { label: "Motor", value: vehicle.engine?.trim() || null },
    { label: "Exterior", value: vehicle.exteriorColor?.trim() || null },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <article className="section-light bg-[#f5f6f7] pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-[#08090b] lg:pb-16">
      <div
        className="mx-auto w-full max-w-[var(--content-max)] py-6 lg:py-12"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <nav aria-label="Migas de pan" className="text-sm text-[#676a70]">
          <ol className="flex min-w-0 flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#08090b]">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              {auctionListing ? (
                <Link href="/subastas" className="hover:text-[#08090b]">
                  Subastas
                </Link>
              ) : (
                <Link href="/inventario" className="hover:text-[#08090b]">
                  Inventario Valcron
                </Link>
              )}
            </li>
            <li aria-hidden>/</li>
            <li className="min-w-0 break-words font-medium text-[#08090b]">
              {year} {make} {model}
            </li>
          </ol>
        </nav>

        <div className="mt-5 grid min-w-0 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-10">
          <VehicleGallery photos={photos} title={title} />

          <aside
            className="min-w-0 border border-[#e8eaed] bg-white p-5 shadow-[0_10px_30px_rgba(8,9,11,0.04)] sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)]"
            style={{ borderRadius: "1rem" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
              >
                {badge.label}
              </p>
              <CurrencySwitch compact tone="light" />
            </div>

            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">
              {year}
            </p>
            <h1 className="mt-1 break-words font-display text-[1.85rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#08090b] sm:text-[2.35rem]">
              {make} {model}
            </h1>
            {vehicle.trim ? (
              <p className="mt-2 text-base text-[#676a70] sm:text-lg">{vehicle.trim}</p>
            ) : null}

            {sold ? (
              <p
                className="mt-5 border border-[#e8eaed] bg-[#f5f6f7] px-4 py-3 text-sm leading-relaxed text-[#676a70]"
                style={{ borderRadius: "0.75rem" }}
              >
                Esta unidad figura como vendida. Conservamos la ficha para consulta. Si buscas algo
                similar, revisa el inventario o escríbenos por WhatsApp.
              </p>
            ) : null}

            <div className="mt-6 border-t border-[#e8eaed] pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a8d91]">
                {price.label}
              </p>
              <p className="mt-1 font-display text-[2rem] font-bold tracking-tight text-[#08090b] sm:text-[2.5rem]">
                {price.primary}
              </p>
              {price.secondary ? (
                <p className="mt-1 text-sm text-[#676a70]">{price.secondary}</p>
              ) : null}
              {priceNote ? (
                <p className="mt-3 text-sm leading-relaxed text-[#676a70]">{priceNote}</p>
              ) : null}
              {auctionListing ? (
                <p className="mt-3 text-sm leading-relaxed text-[#676a70]">{AUCTION_SERVICE_COPY}</p>
              ) : null}
            </div>

            {highlightSpecs.length ? (
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {highlightSpecs.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#eef0f3] bg-[#f8f9fa] px-3 py-3 text-left"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a8d91]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-[#08090b]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-7 hidden flex-col gap-3 lg:flex">
              {!sold ? (
                <a href="#consulta" className="btn-primary h-12 w-full rounded-xl">
                  {primaryCta}
                </a>
              ) : null}
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#d8dbe0] bg-white text-sm font-semibold text-[#08090b] transition hover:border-[#08090b]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
              {canFinance ? (
                <Link
                  href={`/financiamiento?monto=${financeAmount}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-transparent text-sm font-semibold text-[#676a70] underline-offset-4 hover:underline"
                >
                  Conocer opciones de financiamiento
                </Link>
              ) : null}
            </div>
          </aside>
        </div>

        {specs.length ? (
          <section className="mt-12 lg:mt-16">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
              Especificaciones
            </h2>
            <dl
              className="mt-5 grid grid-cols-1 gap-px overflow-hidden border border-[#e8eaed] bg-[#e8eaed] sm:grid-cols-2 lg:grid-cols-3"
              style={{ borderRadius: "1rem" }}
            >
              {specs.map((item) => (
                <div key={item.label} className="bg-white px-4 py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a8d91]">
                    {item.label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-[#08090b]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {features.length ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
              Características
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-xl border border-[#e8eaed] bg-white px-4 py-3 text-sm text-[#3a3d42]"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {description ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
              Descripción
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#3a3d42]">{description}</p>
          </section>
        ) : null}

        {!sold ? (
          <section
            id="consulta"
            className="mt-14 scroll-mt-28 grid min-w-0 gap-8 rounded-2xl border border-[#e8eaed] bg-white p-5 shadow-[0_10px_30px_rgba(8,9,11,0.03)] sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          >
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
                Solicitar información
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#676a70]">
                Déjanos tus datos y un asesor te contacta sobre este {year} {make} {model}. También
                puedes escribirnos por WhatsApp.
              </p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8dbe0] px-5 text-sm font-semibold text-[#08090b] transition hover:border-[#08090b]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
            <QuoteForm
              submitLabel="Solicitar información"
              vehicleId={vehicle.id}
              defaultVehicleInterest={title}
              defaultMessage={auctionListing ? AUCTION_QUOTE_PREFILL : undefined}
            />
          </section>
        ) : null}

        {similar.length ? (
          <section className="mt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
                Vehículos similares
              </h2>
              <Link
                href={auctionListing ? "/subastas" : "/inventario"}
                className="text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
              >
                Ver más
              </Link>
            </div>
            <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((item) => (
                <VehicleCard key={item.id} vehicle={item} tone="light" compact />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {!sold ? (
        <div
          data-sticky-cta
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8eaed] bg-white/95 px-3 pt-2.5 backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#d8dbe0] bg-white px-3 text-[13px] font-semibold text-[#08090b]"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              WhatsApp
            </a>
            <a
              href="#consulta"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#08090b] px-3 text-[13px] font-semibold text-white"
            >
              Solicitar información
            </a>
          </div>
        </div>
      ) : null}
    </article>
  );
}
