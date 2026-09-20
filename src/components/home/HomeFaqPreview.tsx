"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME_FAQS } from "@/lib/home-content";

export function HomeFaqPreview() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section-light bg-[#ececea]" id="preguntas">
      <div className="mx-auto max-w-4xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">FAQ</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Preguntas antes
          <span className="block">de comprar.</span>
        </h2>
        <div className="mt-12 divide-y divide-[#d4d4d4] border-y border-[#d4d4d4]">
          {HOME_FAQS.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={active}
                  onClick={() => setOpen(active ? -1 : index)}
                >
                  <span className="text-sm font-medium text-[#111] sm:text-base">{item.q}</span>
                  <span className="text-[#737373]">{active ? "–" : "+"}</span>
                </button>
                {active ? (
                  <p className="pb-5 text-sm leading-relaxed text-[#525252]">{item.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
        <Link href="/preguntas-frecuentes" className="btn-secondary mt-10">
          Ver todas las preguntas
        </Link>
      </div>
    </section>
  );
}
