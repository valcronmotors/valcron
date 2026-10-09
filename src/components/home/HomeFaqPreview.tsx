"use client";

import Link from "next/link";
import { useState } from "react";
import { PageContainer, Section } from "@/components/public/layout";
import { HOME_FAQS } from "@/lib/home-content";

export function HomeFaqPreview() {
  const [open, setOpen] = useState(0);
  const faqs = HOME_FAQS.slice(0, 3);

  return (
    <Section className="section-light bg-white" id="preguntas" tight>
      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
          <div>
            <h2 className="display-lg text-[#08090b]">
              Preguntas
              <span className="block">frecuentes</span>
            </h2>
            <Link
              href="/preguntas-frecuentes"
              className="mt-6 hidden text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline lg:inline-flex"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {faqs.map((item, index) => {
              const active = open === index;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden border border-[#e4e6ea] bg-[#f7f8fa]"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    aria-expanded={active}
                    onClick={() => setOpen(active ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-[#08090b]">{item.q}</span>
                    <span className="shrink-0 text-2xl font-light text-[#2b6cff]" aria-hidden="true">
                      {active ? "−" : "+"}
                    </span>
                  </button>
                  {active ? (
                    <p className="border-t border-[#e4e6ea] px-5 pb-5 pt-4 text-base leading-relaxed text-[#676a70]">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
            <div className="pt-3 text-center lg:hidden">
              <Link
                href="/preguntas-frecuentes"
                className="text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
