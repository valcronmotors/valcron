"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import {
  PRICE_RANGES,
  inventorySearchHref,
  uniqueAnos,
  uniqueMarcas,
  uniqueModelos,
} from "@/lib/public-filters";
import type { PublicVehicle } from "@/lib/public-catalog";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

const fieldClass = "field-input mt-1.5 bg-white/90";

const LISTING_TABS = [
  { value: "", label: "Todos" },
  { value: "dealer", label: "Stock en Santo Domingo" },
  { value: "auction", label: "Importación por Encargo (Copart / IAAI / Manheim)" },
] as const;

export function HeroShowcase({ vehicles }: { vehicles: PublicVehicle[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [listing, setListing] = useState("");
  const [price, setPrice] = useState("");
  const [searching, setSearching] = useState(false);

  const marcas = useMemo(() => uniqueMarcas(vehicles), [vehicles]);
  const modelos = useMemo(() => uniqueModelos(vehicles, marca), [marca, vehicles]);
  const anos = useMemo(() => uniqueAnos(vehicles), [vehicles]);
  const searchHref = inventorySearchHref({ marca, modelo, ano, listing, price });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HOME_HERO_SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  function handleMarca(value: string) {
    setMarca(value);
    setModelo("");
  }

  async function handleSearch() {
    setSearching(true);
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    router.push(searchHref);
  }

  return (
    <section className="relative isolate min-h-[92vh] pb-40">
      <AnimatePresence mode="sync">
        {HOME_HERO_SLIDES.map((slide, slideIndex) =>
          slideIndex === index ? (
            <motion.div
              key={slide.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className="hero-kenburns object-cover object-center contrast-[1.06]"
              />
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-40 pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="kicker text-accent!">{SITE.name}</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
            {SITE.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/82 sm:text-lg">
            {SITE.heroSubtitle}
          </p>
        </motion.div>

        <div className="mt-8 flex gap-2">
          {HOME_HERO_SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ver imagen ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slideIndex === index ? "w-10 bg-accent" : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearch();
        }}
        className="absolute inset-x-4 bottom-0 z-20 mx-auto max-w-7xl translate-y-1/2 rounded-3xl border border-white/70 bg-white/92 p-4 shadow-[0_28px_90px_rgba(11,12,16,0.22)] backdrop-blur-2xl md:p-6 lg:inset-x-8"
      >
        <div className="flex flex-wrap gap-2">
          {LISTING_TABS.map((tab) => {
            const active = listing === tab.value;
            return (
              <button
                key={tab.value || "all"}
                type="button"
                onClick={() => setListing(tab.value)}
                className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-foreground text-white shadow-sm"
                    : "border border-line bg-white text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_1.15fr_auto]">
          <label className="block kicker">
            Marca
            <select
              value={marca}
              onChange={(event) => handleMarca(event.target.value)}
              className={fieldClass}
            >
              <option value="">Todas</option>
              {marcas.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block kicker">
            Modelo
            <select
              value={modelo}
              onChange={(event) => setModelo(event.target.value)}
              className={fieldClass}
            >
              <option value="">Todos</option>
              {modelos.map((option) => (
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
            Rango de precio
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={fieldClass}
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value || "any"} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={searching}
              className="btn-primary w-full gap-2 xl:min-w-48"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {searching ? "Buscando..." : "Buscar Vehículos"}
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  );
}
