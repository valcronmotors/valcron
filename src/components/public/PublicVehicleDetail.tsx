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
  const facts = [mileage, vehicle.transmission, vehicle.drivetrain, vehicle.fuelType, vehicle.engine]
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter(Boolean);

  return (
    <article className="section-light bg-[#f5f6f7] pb-28 text-[#08090b] lg:pb-16">
      <div
        className="mx-auto w-full max-w-[var(--content-max)] py-8 lg:py-14"
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
              <Link href="/inventario" className="hover:text-[#08090b]">
                Inventario
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="min-w-0 break-words text-[#08090b]">{title}</li>
          </ol>
        </nav>

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-12">
          <VehicleGallery photos={photos} title={title} />

          <div
            className="min-w-0 border border-[#e4e6ea] bg-white p-5 md:p-7 lg:sticky lg:top-24"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
              >
                {badge.label}
              </p>
              <CurrencySwitch compact tone="light" />
            </div>
            <h1 className="mt-4 break-words font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-[#08090b] sm:text-4xl lg:text-[2.75rem]">
              {year} {make} {model}
            </h1>
            {vehicle.trim ? <p className="mt-2 text-base text-[#676a70]">{vehicle.trim}</p> : null}

            {sold ? (
              <p
                className="mt-6 border border-[#e4e6ea] bg-[#f5f6f7] px-4 py-3 text-sm text-[#676a70]"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                Esta unidad figura como vendida. Conservamos la ficha para consulta. Si buscas algo
                similar, revisa el inventario o escríbenos por WhatsApp.
              </p>
            ) : null}

            <div className="mt-6 border-t border-[#e4e6ea] pt-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#676a70]">{price.label}</p>
              <p className="mt-1 font-display text-[2rem] font-bold tracking-tight text-[#08090b] sm:text-4xl">
                {price.primary}
              </p>
              {price.secondary ? <p className="mt-1 text-sm text-[#676a70]">{price.secondary}</p> : null}
              {priceNote ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#676a70]">{priceNote}</p>
              ) : null}
              {auctionListing ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#676a70]">{AUCTION_SERVICE_COPY}</p>
              ) : null}
            </div>

            {facts.length ? (
              <p className="mt-4 text-sm leading-relaxed text-[#676a70]">{facts.join(" · ")}</p>
            ) : null}

            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
              {!sold ? (
                <a href="#consulta" className="btn-primary">
                  {primaryCta}
                </a>
              ) : null}
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              {canFinance ? (
                <Link href={`/financiamiento?monto=${financeAmount}`} className="btn-secondary">
                  Conocer opciones
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {specs.length ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-[#08090b]">Ficha del vehículo</h2>
            <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-[#e4e6ea] bg-[#e4e6ea] sm:grid-cols-2 lg:grid-cols-3"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {specs.map((item) => (
                <div key={item.label} className="bg-white p-4">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-[#676a70]">{item.label}</dt>
                  <dd className="mt-1 break-words text-sm font-medium text-[#08090b]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {description ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#08090b]">Descripción</h2>
            <p className="mt-4 text-base leading-relaxed text-[#3a3d42]">{description}</p>
          </section>
        ) : null}

        {features.length ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#08090b]">Características</h2>
            <ul className="mt-4 grid gap-2 text-base text-[#3a3d42]">
              {features.map((feature) => (
                <li key={feature} className="border-l-2 border-[#2b6cff] pl-4">
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!sold ? (
          <section
            id="consulta"
            className="mt-14 scroll-mt-28 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          >
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-semibold text-[#08090b]">{primaryCta}</h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#676a70]">
                Déjanos tus datos y un asesor te contacta sobre este {title}. También puedes
                escribirnos por WhatsApp.
              </p>
            </div>
            <QuoteForm
              submitLabel={primaryCta}
              vehicleId={vehicle.id}
              defaultVehicleInterest={title}
              defaultMessage={auctionListing ? AUCTION_QUOTE_PREFILL : undefined}
            />
          </section>
        ) : null}

        {similar.length ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-[#08090b]">Vehículos similares</h2>
            <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((item) => (
                <VehicleCard key={item.id} vehicle={item} tone="light" />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {!sold ? (
        <div
          data-sticky-cta
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4e6ea] bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
            <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp h-12">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <a href="#consulta" className="btn-primary h-12">
              {auctionListing ? "Cotizar" : "Solicitar información"}
            </a>
          </div>
        </div>
      ) : null}
    </article>
  );
}
