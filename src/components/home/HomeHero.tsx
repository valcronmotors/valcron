"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Car, Shield, Wallet } from "lucide-react";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

const BENEFITS = [
  { icon: Car, label: "Inventario disponible" },
  { icon: Wallet, label: "Financiamiento con bancos locales" },
  { icon: Shield, label: "Trade-in y búsqueda por encargo" },
];

export function HomeHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HOME_HERO_SLIDES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-[#050505] lg:min-h-[86vh]">
      {HOME_HERO_SLIDES.map((slide, slideIndex) => {
        const active = slideIndex === index;
        const first = slideIndex === 0;
        if (!active && !first) {
          return null;
        }
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={first}
              fetchPriority={first ? "high" : "low"}
              quality={70}
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-black/8" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/12 to-transparent" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-5 pb-28 pt-24 lg:min-h-[86vh] lg:px-8 lg:pb-32">
        <div className="hero-on-dark max-w-3xl">
          <p className="kicker text-[#C7A96B]">{SITE.heroEyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.4rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Encuentra el vehículo ideal para ti.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
            </Link>
            <Link href="/solicitar-vehiculo" className="btn-secondary">
              Solicitar vehículo
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-white/12 bg-black/40 px-4 py-3"
            >
              <item.icon className="h-4 w-4 shrink-0 text-[#C7A96B]" strokeWidth={1.75} />
              <p className="text-sm leading-snug text-white/85">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
