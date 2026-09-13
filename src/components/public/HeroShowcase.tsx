"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PRICE_RANGES,
  inventorySearchHref,
  uniqueAnos,
  uniqueMarcas,
} from "@/lib/public-filters";
import type { PublicVehicle } from "@/lib/public-catalog";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

const fieldClass = "field-input mt-1.5";

export function HeroShowcase({ vehicles }: { vehicles: PublicVehicle[] }) {
  const [index, setIndex] = useState(0);
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [listing, setListing] = useState("");
  const [price, setPrice] = useState("");

  const marcas = useMemo(() => uniqueMarcas(vehicles), [vehicles]);
  const anos = useMemo(() => uniqueAnos(vehicles), [vehicles]);

  const searchHref = inventorySearchHref({ marca, ano, listing, price });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HOME_HERO_SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[88vh] pb-32">
      {HOME_HERO_SLIDES.map((slide, slideIndex) => (
        <div
          key={slide.src}
          className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className="object-cover object-center contrast-[1.05]"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-36 pt-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="kicker text-accent!">{SITE.name}</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
            {SITE.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/82 sm:text-lg">
            {SITE.heroSubtitle}
          </p>
        </div>

        <div className="mt-8 flex gap-2">
          {HOME_HERO_SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ver imagen ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition ${
                slideIndex === index ? "w-10 bg-accent" : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <form
        action={searchHref}
        className="absolute inset-x-4 bottom-0 z-20 mx-auto max-w-7xl translate-y-1/2 rounded-2xl border border-line bg-white/95 p-4 shadow-[0_24px_80px_rgba(11,12,16,0.16)] backdrop-blur-xl md:p-5 lg:inset-x-8"
      >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_0.8fr_1.2fr_1.3fr_auto]">
            <label className="block kicker">
              Marca
              <select value={marca} onChange={(event) => setMarca(event.target.value)} className={fieldClass}>
                <option value="">Todas</option>
                {marcas.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block kicker">
              Año
              <select value={ano} onChange={(event) => setAno(event.target.value)} className={fieldClass}>
                <option value="">Todos</option>
                {anos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block kicker">
              Condición
              <select
                value={listing}
                onChange={(event) => setListing(event.target.value)}
                className={fieldClass}
              >
                <option value="">Todas</option>
                <option value="dealer">En RD</option>
                <option value="auction">En Subasta</option>
              </select>
            </label>
            <label className="block kicker">
              Rango de precio
              <select value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass}>
                {PRICE_RANGES.map((range) => (
                  <option key={range.value || "any"} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Link
                href={searchHref}
                className="btn-primary w-full xl:min-w-44"
              >
                Buscar Vehículo
              </Link>
            </div>
          </div>
        </form>
    </section>
  );
}
