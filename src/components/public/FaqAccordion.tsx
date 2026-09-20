"use client";

import { useState } from "react";
import { HOME_FAQS } from "@/lib/home-content";

export function FaqAccordion({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState(0);
  const light = tone === "light";

  return (
    <div
      className={`divide-y border-y ${
        light ? "divide-[#d4d4d4] border-[#d4d4d4]" : "divide-white/10 border-white/10"
      }`}
    >
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
              <span
                className={`text-sm font-medium sm:text-base ${light ? "text-[#111]" : "text-white"}`}
              >
                {item.q}
              </span>
              <span className={light ? "text-[#737373]" : "text-[#d4d4d4]"}>{active ? "–" : "+"}</span>
            </button>
            {active ? (
              <p className={`pb-5 text-sm leading-relaxed ${light ? "text-[#404040]" : "text-[#d4d4d4]"}`}>
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
