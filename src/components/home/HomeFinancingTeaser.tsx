import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

/** One premium visual financing card — details live on /financiamiento. */
export function HomeFinancingTeaser() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <Link
          href="/financiamiento"
          className="group relative block overflow-hidden border border-[#e4e6ea] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(8,9,11,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="relative aspect-[21/9] min-h-[11rem] sm:min-h-[12.5rem] lg:aspect-[3/1]">
            <Image
              src={EDITORIAL.documents.src}
              alt={EDITORIAL.documents.alt}
              fill
              sizes="(max-width: 1280px) 94vw, 1120px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#08090b]/88 via-[#08090b]/55 to-[#08090b]/20"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-8 lg:p-10">
              <div className="max-w-[28rem]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Financiamiento
                </p>
                <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Explora opciones con bancos locales.
                </h2>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Conocer opciones
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </PageContainer>
    </Section>
  );
}
