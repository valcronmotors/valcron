"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

const TABS = [
  {
    id: "comprar",
    label: "Comprar",
    title: "Elige entre lo publicado.",
    copy: "Inventario local con fotos y precios de las unidades disponibles.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.compactSuv,
  },
  {
    id: "subastas",
    label: "Subastas",
    title: "Oportunidades que Valcron publica.",
    copy: "Plataformas de Estados Unidos como fuente de mercado, no como socios.",
    href: "/subastas",
    cta: "Ver subastas",
    image: EDITORIAL.processSearch,
  },
  {
    id: "importacion",
    label: "Importación",
    title: "La llegada se coordina por caso.",
    copy: "Transporte y costos se confirman antes de avanzar.",
    href: "/importacion",
    cta: "Ver importación",
    image: EDITORIAL.port,
  },
  {
    id: "financiamiento",
    label: "Financiamiento",
    title: "Orientación con bancos locales.",
    copy: "La aprobación la define cada institución. Valcron no es un banco.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
    image: EDITORIAL.processFinance,
  },
] as const;

export function HomeDiscover() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("comprar");
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <Section className="section-light bg-white">
      <PageContainer wide>
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-[#08090b] md:text-5xl">
          Descubre Valcron
        </h2>
        <div
          className="mt-8 flex justify-start gap-6 overflow-x-auto border-b border-[#e5e5e5] md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Descubre Valcron"
        >
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`relative -mb-px shrink-0 pb-3 text-sm font-medium md:text-base ${
                  selected ? "text-[#08090b]" : "text-[#8a8d91] hover:text-[#191919]"
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
                {selected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#08090b]" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-stretch bg-[#f7f8fa] lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]" role="tabpanel">
          <div className="relative min-h-[14rem] sm:min-h-[18rem] lg:min-h-[28rem]">
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
            <h3 className="font-display text-2xl font-bold tracking-tight text-[#08090b] md:text-4xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-[28rem] text-base leading-relaxed text-[#676a70]">{active.copy}</p>
            <Link href={active.href} className="btn-primary mt-6 w-fit px-6 text-sm">
              {active.cta}
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
