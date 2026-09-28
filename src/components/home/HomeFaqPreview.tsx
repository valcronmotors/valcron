"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME_FAQS } from "@/lib/home-content";

export function HomeFaqPreview() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section-light bg-[#eef0f3]" id="preguntas">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-24">
        <p className="kicker">FAQ</p>
        <h2 className="display-section mt-3 text-[#08090b]">
          Preguntas antes
          <span className="block">de comprar.</span>
        </h2>
        <div className="mt-12 divide-y divide-[#e4e6ea] border-y border-[#e4e6ea]">
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
                  <span className="text-base font-medium text-[#08090b]">{item.q}</span>
                  <span className="shrink-0 text-[#676a70]" aria-hidden="true">
                    {active ? "–" : "+"}
                  </span>
                </button>
                {active ? (
                  <p className="pb-5 text-base leading-relaxed text-[#676a70]">{item.a}</p>
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
