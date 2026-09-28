"use client";

import Link from "next/link";
import { useState } from "react";
import { PageContainer, Section } from "@/components/public/layout";
import { HOME_FAQS } from "@/lib/home-content";

export function HomeFaqPreview() {
  const [open, setOpen] = useState(0);
  const faqs = HOME_FAQS.slice(0, 7);

  return (
    <Section className="section-light bg-[#f5f6f7]" id="preguntas" tight>
      <PageContainer>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="display-lg text-[#08090b]">FAQ&apos;s</h2>
          <p className="mt-3 text-[length:var(--text-body-lg)] text-[#676a70]">
            ¿Todavía tienes preguntas?
          </p>
          <Link href="/solicitar-vehiculo" className="btn-secondary mt-6">
            Solicitar vehículo
          </Link>
        </div>

        <div className="mx-auto mt-10 max-w-[40rem] space-y-3 md:mt-12">
          {faqs.map((item, index) => {
            const active = open === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden border border-[#e4e6ea] bg-white"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  aria-expanded={active}
                  onClick={() => setOpen(active ? -1 : index)}
                >
                  <span className="text-base font-semibold leading-snug text-[#08090b] md:text-lg">
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
                  <p className="border-t border-[#eef0f3] px-5 pb-5 pt-4 text-base leading-relaxed text-[#676a70] md:px-6">
                    {item.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/preguntas-frecuentes"
            className="text-sm font-semibold text-[#08090b] underline-offset-4 hover:underline"
          >
            Ver todas las preguntas
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
