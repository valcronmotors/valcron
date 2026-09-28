import Link from "next/link";
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
    title: "Artículos para decidir con más contexto",
    subtitle:
      "Noticias, análisis y contexto para comprar un vehículo con más información.",
    empty: "Todavía no hay artículos publicados.",
    image: PAGE_HERO_IMAGES.servicios,
    imageAlt: PAGE_HERO_ALTS.servicios,
  },
  guide: {
    kicker: "Guías",
    title: "Recursos paso a paso para comprar e importar",
    subtitle:
      "Guías prácticas y permanentes: inventario, financiamiento, subastas e importación.",
    empty: "Todavía no hay guías publicadas.",
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
      <PageHero kicker={copy.kicker} title={copy.title} subtitle={copy.subtitle} image={copy.image} imageAlt={copy.imageAlt} />
      <section className="section-light bg-[#f6f5f1]">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          {categories.length ? (
            <p className="text-xs uppercase tracking-[0.16em] text-[#676a70]">
              Temas: {categories.join(" · ")}
            </p>
          ) : null}

          {featured ? (
            <Link
              href={contentPath(featured)}
              className="mt-8 grid min-w-0 overflow-hidden border border-[#e5e3de] bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
              style={{ borderRadius: "var(--radius-panel)" }}
            >
              <div className="relative aspect-[16/10] min-h-[13rem] lg:aspect-auto lg:min-h-[24rem]">
                <EditorialImage
                  src={featured.hero.src}
                  alt={featured.hero.alt}
                  className="object-cover"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="kicker">{featured.category}</p>
                <h2 className="mt-3 text-balance break-words font-display text-3xl font-semibold tracking-tight text-[#111214] sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#676a70]">{featured.excerpt}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#676a70]">
                  {formatContentDate(featured.publishedAt)} · {readingTimeMinutes(featured)} min de
                  lectura
                </p>
              </div>
            </Link>
          ) : (
            <p className="mt-8 text-base text-[#676a70]">{copy.empty}</p>
          )}

          {rest.length ? (
            <div className="mt-12 grid gap-8 border-t border-[#e5e3de] pt-10 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={contentPath(article)}
                  className="group flex min-w-0 flex-col"
                >
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-[#1b1d20]"
                    style={{ borderRadius: "var(--radius-lg)" }}
                  >
                    <EditorialImage
                      src={article.hero.src}
                      alt={article.hero.alt}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9b793f]">
                      {article.category}
                    </p>
                    <h2 className="mt-2 text-balance break-words font-display text-xl font-semibold text-[#111214] md:text-2xl">
                      {article.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#676a70]">
                      {article.excerpt}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#676a70]">
                      {readingTimeMinutes(article)} min de lectura
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
