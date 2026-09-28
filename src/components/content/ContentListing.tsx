import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import {
  contentPath,
  formatContentDate,
  listArticles,
  readingTimeMinutes,
  type ContentKind,
} from "@/lib/content";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { EditorialImage } from "@/components/shared/EditorialImage";

const COPY: Record<
  ContentKind,
  { kicker: string; title: string; subtitle: string; empty: string; image: string; imageAlt: string }
> = {
  blog: {
    kicker: "Blog",
    title: "Contexto para decidir mejor",
    subtitle: "Artículos breves sobre compra, financiamiento e importación.",
    empty: "Pronto publicaremos nuevos artículos.",
    image: PAGE_HERO_IMAGES.servicios,
    imageAlt: PAGE_HERO_ALTS.servicios,
  },
  guide: {
    kicker: "Guías",
    title: "Pasos claros, sin tecnicismos",
    subtitle: "Recursos permanentes sobre inventario, subastas e importación.",
    empty: "Pronto publicaremos nuevas guías.",
    image: PAGE_HERO_IMAGES.importacion,
    imageAlt: PAGE_HERO_ALTS.importacion,
  },
};

export function ContentListing({ kind }: { kind: ContentKind }) {
  const articles = listArticles(kind);
  const featured = articles[0];
  const rest = articles.slice(1);
  const copy = COPY[kind];
  const categories = [...new Set(articles.map((article) => article.category))];

  return (
    <main>
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        subtitle={copy.subtitle}
        image={copy.image}
        imageAlt={copy.imageAlt}
      />
      <Section className="section-light bg-[#f7f8fa]">
        <PageContainer>
          {categories.length ? (
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#676a70]">
              Temas: {categories.join(" · ")}
            </p>
          ) : null}

          {featured ? (
            <Link
              href={contentPath(featured)}
              className="mt-8 grid min-w-0 overflow-hidden border border-[#e4e6ea] bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="relative aspect-[16/10] min-h-[13rem] bg-[#12141a] lg:aspect-auto lg:min-h-[24rem]">
                <EditorialImage
                  src={featured.hero.src}
                  alt={featured.hero.alt}
                  className="object-cover"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="kicker !text-[#676a70]">{featured.category}</p>
                <h2 className="mt-3 text-balance break-words font-display text-3xl font-semibold tracking-tight text-[#08090b] sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-base leading-relaxed text-[#676a70]">
                  {featured.excerpt}
                </p>
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-[#676a70]">
                  {formatContentDate(featured.publishedAt)} · {readingTimeMinutes(featured)} min
                </p>
              </div>
            </Link>
          ) : (
            <p className="mt-8 text-base text-[#676a70]">{copy.empty}</p>
          )}

          {rest.length ? (
            <div className="mt-12 grid gap-8 border-t border-[#e4e6ea] pt-10 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={contentPath(article)}
                  className="group flex min-w-0 flex-col"
                >
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-[#12141a]"
                    style={{ borderRadius: "var(--radius-card)" }}
                  >
                    <EditorialImage
                      src={article.hero.src}
                      alt={article.hero.alt}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#676a70]">
                      {article.category}
                    </p>
                    <h2 className="mt-2 text-balance break-words font-display text-xl font-semibold text-[#08090b] md:text-2xl">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#676a70]">
                      {article.excerpt}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#676a70]">
                      {readingTimeMinutes(article)} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </PageContainer>
      </Section>
    </main>
  );
}
