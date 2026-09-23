"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Car, Shield, Wallet } from "lucide-react";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";

const BENEFITS = [
  { icon: Car, label: "Vehículos disponibles" },
  { icon: Wallet, label: "Financiamiento con bancos locales" },
  { icon: Shield, label: "Orientación en seguro y protección" },
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
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-[#050505] lg:min-h-[92vh]">
      <AnimatePresence mode="sync">
        {HOME_HERO_SLIDES.map((slide, slideIndex) =>
          slideIndex === index ? (
            <motion.div
              key={slide.src}
              initial={slideIndex === 0 ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className="hero-kenburns object-cover object-[center_40%]"
              />
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-black/8" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/12 to-transparent" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-5 pb-32 pt-28 lg:min-h-[92vh] lg:justify-end lg:px-8 lg:pb-32">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="kicker">{SITE.heroEyebrow}</p>
          <div className="mt-4 h-px w-16 bg-[#C7A96B]" />
          <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.65rem] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Tu próximo vehículo{" "}
            <span className="block">empieza aquí.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/74 sm:text-lg">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
            </Link>
            <Link href="/#buscar" className="btn-secondary">
              Buscar vehículo
            </Link>
          </div>
        </motion.div>

        <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-md"
            >
              <item.icon className="h-4 w-4 shrink-0 text-[#C7A96B]" strokeWidth={1.75} />
              <p className="text-sm leading-snug text-white/82">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
