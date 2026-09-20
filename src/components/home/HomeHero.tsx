"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gavel, MessageCircle, Ship } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { HOME_HERO_SLIDES } from "@/lib/hero-media";
import { SITE, whatsappHref } from "@/lib/site";

const BENEFITS = [
  { icon: Ship, label: "Importación desde EE.UU." },
  { icon: Gavel, label: "Compra en subastas" },
  { icon: MessageCircle, label: "Asesoría personalizada" },
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
                className="hero-kenburns object-cover object-[center_38%]"
              />
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/38" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/42 to-black/12" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/18 to-transparent" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-5 pb-32 pt-28 lg:min-h-[92vh] lg:justify-end lg:px-8 lg:pb-32">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="kicker">{SITE.heroEyebrow}</p>
          <div className="mt-4 h-px w-16 bg-[#C7A96B]" />
          <h1 className="mt-5 max-w-3xl font-display text-[2.65rem] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Conectamos tus sueños
            <span className="block">sin fronteras.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/74 sm:text-lg">
            {SITE.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inventario" className="btn-primary">
              Explorar Inventario
            </Link>
            <Link href="/importacion" className="btn-secondary">
              Importar un Vehículo
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[2.85rem] items-center gap-2 rounded-[0.9rem] border border-white/18 px-5 text-sm font-medium text-white transition hover:border-[#C7A96B]/70 hover:bg-white/6"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
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
