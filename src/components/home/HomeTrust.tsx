import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { SITE } from "@/lib/site";

/** Verified company facts only. No reviews, ratings, or delivery photos. */
export function HomeTrust() {
  return (
    <Section className="section-light bg-[#F5F5F5]" tight>
      <PageContainer wide>
        <div className="mx-auto flex max-w-[48rem] flex-col items-center gap-5 border border-[#E5E7EB] bg-white px-6 py-8 text-center sm:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Empresa</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#111111] md:text-3xl">
              Valcron Motors Group, SRL
            </h2>
            <p className="mx-auto mt-3 max-w-[32rem] text-sm leading-relaxed text-[#3B3B3B]">
              Dealer en {SITE.address.city}. Inventario publicado, búsqueda personalizada y orientación con
              bancos locales.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[#3B3B3B]">
            {SITE.address.full}
            <span className="mt-1 block font-semibold text-[#111111]">{SITE.phoneOffice}</span>
          </p>
          <Link href="/contacto" className="btn-primary h-11 px-6 text-sm">
            Cómo llegar
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
