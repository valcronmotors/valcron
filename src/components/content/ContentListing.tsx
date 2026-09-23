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
      "Explicaciones, comparaciones y actualizaciones sobre importación, subastas y compra de vehículos en República Dominicana.",
    empty: "Todavía no hay artículos publicados.",
    image: PAGE_HERO_IMAGES.servicios,
    imageAlt: PAGE_HERO_ALTS.servicios,
  },
  guide: {
    kicker: "Guías",
    title: "Recursos paso a paso para comprar e importar",
    subtitle:
      "Guías evergreen: importación a República Dominicana, subastas de Estados Unidos, costos aproximados, VIN y revisión de usados.",
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
      <section className="section-light bg-[#faf9f6]">
        <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          {categories.length ? (
            <p className="text-xs uppercase tracking-[0.16em] text-[#737373]">
              Temas: {categories.join(" · ")}
            </p>
          ) : null}

          {featured ? (
            <Link
              href={contentPath(featured)}
              className="mt-8 grid min-w-0 overflow-hidden rounded-[1.5rem] border border-[#ececea] bg-white lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            >
              <div className="relative aspect-[16/10] min-h-[13rem] lg:aspect-auto lg:min-h-[22rem]">
                <EditorialImage
                  src={featured.hero.src}
                  alt={featured.hero.alt}
                  className="object-cover"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10">
                <p className="kicker">{featured.category}</p>
                <h2 className="mt-3 text-balance break-words font-display text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#525252]">{featured.excerpt}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#737373]">
                  {formatContentDate(featured.publishedAt)} · {readingTimeMinutes(featured)} min de lectura
                </p>
              </div>
            </Link>
          ) : (
            <p className="mt-8 text-sm text-[#525252]">{copy.empty}</p>
          )}

          {rest.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={contentPath(article)}
                  className="flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-[#ececea] bg-white transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
                >
                  <div className="relative aspect-[16/10]">
                    <EditorialImage
                      src={article.hero.src}
                      alt={article.hero.alt}
                      className="object-cover"
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="kicker">{article.category}</p>
                    <h2 className="mt-3 text-balance break-words font-display text-2xl font-semibold text-[#111]">{article.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#525252]">{article.excerpt}</p>
                    <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[#737373]">
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
