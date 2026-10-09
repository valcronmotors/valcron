import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { SITE } from "@/lib/site";

/** Verified company facts only. No reviews, ratings, or delivery photos. */
export function HomeTrust() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer wide>
        <div className="grid gap-6 border border-[#e4e6ea] bg-white px-5 py-6 sm:px-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#08090b] md:text-3xl">
              Valcron Motors
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#676a70]">
              Dealer en {SITE.address.city}. Inventario publicado, búsqueda y orientación con bancos locales.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[#3a3d42]">
            {SITE.address.full}
            <span className="mt-1 block font-semibold">{SITE.phoneOffice}</span>
          </p>
          <Link href="/contacto" className="btn-secondary h-11 w-fit px-5 text-sm">
            Cómo llegar
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
