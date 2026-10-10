"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";
import { HOME_CONSULT_IMAGE } from "@/lib/hero-media";

const TABS = [
  {
    id: "comprar",
    label: "Comprar",
    title: "Unidades publicadas por Valcron.",
    copy: "Inventario local con fotos y precios cuando hay stock.",
    href: "/inventario",
    cta: "Ver inventario",
    image: EDITORIAL.compactSuv,
  },
  {
    id: "subastas",
    label: "Subastas",
    title: "Oportunidades en Estados Unidos.",
    copy: "Solo oportunidades que Valcron publica desde Admin.",
    href: "/subastas",
    cta: "Ver subastas",
    image: EDITORIAL.processBrowse,
  },
  {
    id: "importacion",
    label: "Importación",
    title: "Coordinamos tu importación.",
    copy: "Transporte y llegada confirmados para tu caso.",
    href: "/importacion",
    cta: "Ver importación",
    image: EDITORIAL.processImport,
  },
  {
    id: "financiamiento",
    label: "Financiamiento",
    title: "Opciones con bancos locales.",
    copy: "Orientación clara. La aprobación la define cada banco.",
    href: "/financiamiento",
    cta: "Ver financiamiento",
    image: HOME_CONSULT_IMAGE,
  },
] as const;

export function HomeDiscover() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("comprar");
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <Section className="section-light bg-white">
      <PageContainer wide>
        <div className="mx-auto max-w-[36rem] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            Descubre Valcron
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
            Elige el camino que necesitas
          </h2>
        </div>
        <div
          className="mt-8 flex justify-start gap-6 overflow-x-auto border-b border-[#E5E7EB] md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  selected ? "text-[#111111]" : "text-[#6b7280] hover:text-[#3B3B3B]"
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
                {selected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#111111]" /> : null}
              </button>
            );
          })}
        </div>

        <div
          className="mt-8 grid items-stretch overflow-hidden border border-[#E5E7EB] bg-[#F5F5F5] lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]"
          role="tabpanel"
        >
          <div className="relative min-h-[14rem] sm:min-h-[18rem] lg:min-h-[26rem]">
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col items-center justify-center px-5 py-8 text-center sm:px-8 lg:px-10 lg:py-12">
            <h3 className="font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-[26rem] text-base leading-relaxed text-[#3B3B3B]">{active.copy}</p>
            <Link href={active.href} className="btn-primary mt-6 h-11 px-6 text-sm">
              {active.cta}
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
