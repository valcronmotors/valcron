import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { RESOURCE_NAV } from "@/lib/site";

export function HomeResourcesPreview() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer wide>
        <div className="mx-auto max-w-[36rem] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Recursos</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
            Guías y herramientas
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3B3B3B]">
            Contenido útil antes de comprar.
          </p>
        </div>
        <ul className="mx-auto mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {RESOURCE_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-14 items-center justify-between gap-3 border border-[#E5E7EB] bg-[#F5F5F5] px-4 text-sm font-semibold text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-white"
              >
                {item.label}
                <ArrowRight className="h-4 w-4 shrink-0 text-[#111111]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
