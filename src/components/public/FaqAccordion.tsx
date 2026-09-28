"use client";

import { useState } from "react";
import { PAGE_FAQS } from "@/lib/home-content";

export function FaqAccordion({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState(0);
  const light = tone === "light";

  return (
    <div className="space-y-3">
      {PAGE_FAQS.map((item, index) => {
        const active = open === index;
        return (
          <div
            key={item.q}
            className={`overflow-hidden border ${
              light ? "border-[#e4e6ea] bg-white" : "border-white/12 bg-white/[0.04]"
            }`}
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
              aria-expanded={active}
              onClick={() => setOpen(active ? -1 : index)}
            >
              <span
                className={`text-base font-semibold leading-snug md:text-lg ${
                  light ? "text-[#08090b]" : "text-white"
                }`}
              >
                {item.q}
              </span>
              <span
                className="shrink-0 text-2xl font-light leading-none text-[#2b6cff]"
                aria-hidden="true"
              >
                {active ? "−" : "+"}
              </span>
            </button>
            {active ? (
              <p
                className={`border-t px-5 pb-5 pt-4 text-base leading-relaxed md:px-6 ${
                  light
                    ? "border-[#eef0f3] text-[#676a70]"
                    : "border-white/10 text-white/70"
                }`}
              >
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
