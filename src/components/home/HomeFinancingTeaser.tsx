import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

export function HomeFinancingTeaser() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div
          className="flex flex-col items-start justify-between gap-4 border border-[#e4e6ea] bg-[#f7f8fa] px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="max-w-[36rem]">
            <p className="kicker !text-[#676a70]">Financiamiento</p>
            <h2 className="font-display mt-2 text-xl font-bold tracking-tight text-[#08090b] sm:text-2xl">
              Opciones con bancos locales
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#676a70]">
              Orientación sobre financiamiento disponible; la aprobación y condiciones dependen de cada entidad.
            </p>
          </div>
          <Link href="/financiamiento" className="btn-primary h-11 shrink-0 px-5 text-sm">
            Conocer financiamiento
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
