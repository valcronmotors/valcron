"use client";

import { useState } from "react";
import { HOME_FAQS } from "@/lib/home-content";

export function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
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
              <span className="text-sm font-medium text-white sm:text-base">{item.q}</span>
              <span className="text-white/50">{active ? "–" : "+"}</span>
            </button>
            {active ? <p className="pb-5 text-sm leading-relaxed text-white/60">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
