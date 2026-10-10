import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { RESOURCE_NAV } from "@/lib/site";

export function HomeResourcesPreview() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer wide>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[28rem]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Recursos</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
              Guías y herramientas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3B3B3B]">
              Contenido útil antes de comprar — sin repetir el proceso en cada sección.
            </p>
          </div>
          <ul className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-xl">
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
        </div>
      </PageContainer>
    </Section>
  );
}
