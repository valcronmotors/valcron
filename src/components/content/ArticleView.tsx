import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleHeadings,
  contentPath,
  formatContentDate,
  getRelatedArticles,
  readingTimeMinutes,
  type ContentArticle,
  type ContentBlock,
} from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE, whatsappHref } from "@/lib/site";
import { BusinessLocation } from "@/components/public/BusinessLocation";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) {
          return <span key={index}>{part}</span>;
        }
        const [, label, href] = match;
        const external = href.startsWith("http");
        return (
          <Link
            key={index}
            href={href}
            className="font-medium text-[#111] underline decoration-[#C7A96B]/70 underline-offset-4 hover:decoration-[#C7A96B]"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  if (block.type === "p") {
    return (
      <p className="text-[1.05rem] leading-8 text-[#404040]">
        <RichText text={block.text} />
      </p>
    );
  }
  if (block.type === "h2") {
    return (
      <h2 id={block.id} className="scroll-mt-28 font-display text-3xl font-semibold tracking-tight text-[#111]">
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3 id={block.id} className="scroll-mt-28 font-display text-2xl font-semibold text-[#111]">
        {block.text}
      </h3>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[1.05rem] leading-8 text-[#404040]">
        {block.items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol className="list-decimal space-y-2 pl-5 text-[1.05rem] leading-8 text-[#404040]">
        {block.items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ol>
    );
  }
  return (
    <aside className="rounded-2xl border border-[#C7A96B]/35 bg-[#111111] px-5 py-4 text-[#D4D4D4]">
      {block.title ? <p className="text-sm font-semibold text-white">{block.title}</p> : null}
      <p className={`text-sm leading-relaxed ${block.title ? "mt-2" : ""}`}>
        <RichText text={block.text} />
      </p>
    </aside>
  );
}

export function ArticleView({ article }: { article: ContentArticle }) {
  const path = contentPath(article);
  const hub = article.kind === "guide" ? { href: "/guias", label: "Guías" } : { href: "/blog", label: "Blog" };
  const headings = articleHeadings(article);
  const related = getRelatedArticles(article);
  const minutes = readingTimeMinutes(article);
  const published = formatContentDate(article.publishedAt);
  const updated = formatContentDate(article.updatedAt);
  const faq = article.faq ?? [];
  const whatsapp = whatsappHref(`Hola, leí “${article.title}” y quiero orientación de Valcron Motors.`);

  return (
    <main className="section-light bg-[#faf9f6]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: hub.label, path: hub.href },
          { name: article.title, path },
        ])}
      />
      <JsonLd data={articleJsonLd(article, path)} />
      {faq.length ? <JsonLd data={faqJsonLd(faq)} /> : null}

      <article className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <nav aria-label="Migas de pan" className="text-sm text-[#737373]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#111]">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={hub.href} className="hover:text-[#111]">
                {hub.label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#111]">{article.title}</li>
          </ol>
        </nav>

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,0.28fr)]">
          <div className="min-w-0">
            <p className="kicker">{article.category}</p>
            <h1 className="mt-3 max-w-[22ch] font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525252]">{article.excerpt}</p>
            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[#737373]">
              {published ? `Publicado ${published}` : null}
              {updated && updated !== published ? ` · Actualizado ${updated}` : null}
              {` · ${minutes} min de lectura`}
            </p>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[#ececea] bg-[#111]">
              <EditorialImage
                src={article.hero.src}
                alt={article.hero.alt}
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>

            <div className="mt-10 max-w-[46rem] space-y-6">
              {article.blocks.map((block, index) => (
                <BlockView key={`${block.type}-${index}`} block={block} />
              ))}
            </div>

            {faq.length ? (
              <section className="mt-14 max-w-[46rem]">
                <h2 className="font-display text-3xl font-semibold text-[#111]">Preguntas frecuentes</h2>
                <div className="mt-6 grid gap-4">
                  {faq.map((item) => (
                    <div key={item.question} className="rounded-2xl border border-[#ececea] bg-white p-5">
                      <h3 className="font-display text-xl font-semibold text-[#111]">{item.question}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#404040]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {related.length ? (
              <section className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-[#111]">Relacionado</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={`${item.kind}-${item.slug}`}
                      href={contentPath(item)}
                      className="rounded-2xl border border-[#ececea] bg-white p-5 hover:border-[#C7A96B]/40"
                    >
                      <p className="kicker">{item.kind === "guide" ? "Guía" : "Blog"}</p>
                      <p className="mt-2 font-display text-xl font-semibold text-[#111]">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-14 max-w-[46rem]">
              <BusinessLocation variant="cta" />
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            {headings.length > 3 ? (
              <div className="rounded-2xl border border-[#ececea] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#737373]">Contenido</p>
                <ol className="mt-3 grid gap-2 text-sm text-[#404040]">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="hover:text-[#111]">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D0E10] p-5 text-[#D4D4D4]">
              <p className="text-sm font-semibold text-white">{SITE.shortName}</p>
              <p className="mt-2 text-sm leading-relaxed">
                Dealer en Santo Domingo Este. Orientación de inventario, importación y subastas.
              </p>
              <Link
                href={article.cta.href}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[0.9rem] bg-white text-sm font-semibold uppercase tracking-[0.12em] text-[#111]"
              >
                {article.cta.label}
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-[0.9rem] border border-white/15 text-sm text-white"
              >
                WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
