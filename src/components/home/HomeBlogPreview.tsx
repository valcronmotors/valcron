import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { HOME_ARTICLES } from "@/lib/home-content";

export function HomeBlogPreview() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="Recursos"
            title={
              <>
                Antes de comprar,
                <span className="block">conoce lo importante.</span>
              </>
            }
            subtitle="Guías y artículos para entender inventario, financiamiento, títulos y costos."
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="btn-secondary">
              Ver blog
            </Link>
            <Link href="/guias" className="btn-secondary">
              Ver guías
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {HOME_ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group block overflow-hidden border border-[#e4e6ea] bg-[#f5f6f7] transition-opacity duration-180 hover:opacity-95"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#12141a]">
                <EditorialImage
                  src={article.image.src}
                  alt={article.image.alt}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
                  {article.category}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[#08090b]">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
