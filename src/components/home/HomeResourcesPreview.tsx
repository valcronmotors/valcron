import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { RESOURCE_NAV } from "@/lib/site";

export function HomeResourcesPreview() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker !text-[#676a70]">Recursos</p>
            <h2 className="display-lg mt-2 text-[#08090b]">Guías y herramientas</h2>
            <p className="mt-2 max-w-[28rem] text-sm text-[#676a70]">
              Artículos, calculadoras y respuestas útiles antes de comprar.
            </p>
          </div>
          <ul className="grid w-full gap-2 sm:max-w-md sm:grid-cols-2">
            {RESOURCE_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center justify-between gap-2 border border-[#e4e6ea] bg-white px-4 text-sm font-semibold text-[#08090b] transition-colors hover:border-[#2b6cff]/30"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#2b6cff]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageContainer>
    </Section>
  );
}
