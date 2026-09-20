"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate min-h-[48vh] overflow-hidden md:min-h-[56vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="hero-kenburns object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />
      <div className="relative mx-auto flex min-h-[48vh] max-w-7xl items-end px-5 py-16 md:min-h-[56vh] lg:px-8 lg:py-20">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <p className="kicker text-white/55">{kicker}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-base">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
