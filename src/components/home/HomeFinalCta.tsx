import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

export function HomeFinalCta() {
  return (
    <Section className="section-dark bg-[#08090b]" tight>
      <PageContainer>
        <div className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <h2 className="display-lg text-balance text-white">Revisa las opciones publicadas.</h2>
          <p className="mt-3 text-base text-white/70">Inventario local y búsqueda cuando no está en stock.</p>
          <Link
            href="/inventario"
            className="mt-7 inline-flex h-12 min-w-[14rem] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#08090b] transition-colors hover:bg-[#f3f4f6]"
          >
            Ver inventario
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
