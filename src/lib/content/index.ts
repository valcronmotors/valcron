import { BLOG_ARTICLES } from "@/lib/content/blog-articles";
import { GUIDE_ARTICLES } from "@/lib/content/guide-articles";
import type { ContentArticle, ContentKind } from "@/lib/content/types";

export type { ContentArticle, ContentBlock, ContentKind } from "@/lib/content/types";

const ALL_ARTICLES: ContentArticle[] = [...BLOG_ARTICLES, ...GUIDE_ARTICLES];

export function contentPath(article: Pick<ContentArticle, "kind" | "slug">) {
  return article.kind === "guide" ? `/guias/${article.slug}` : `/blog/${article.slug}`;
}

export function listArticles(kind: ContentKind) {
  return ALL_ARTICLES.filter((article) => article.kind === kind).sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export function getArticle(kind: ContentKind, slug: string) {
  return ALL_ARTICLES.find((article) => article.kind === kind && article.slug === slug) ?? null;
}

export function getRelatedArticles(article: ContentArticle) {
  return article.related
    .map((item) => getArticle(item.kind, item.slug))
    .filter((item): item is ContentArticle => Boolean(item));
}

export function readingTimeMinutes(article: ContentArticle) {
  const text = [
    article.title,
    article.excerpt,
    ...article.blocks.flatMap((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "h3") return block.text;
      if (block.type === "callout") return `${block.title ?? ""} ${block.text}`;
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      return "";
    }),
    ...(article.faq ?? []).flatMap((item) => [item.question, item.answer]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function articleHeadings(article: ContentArticle) {
  return article.blocks.filter((block) => block.type === "h2") as Extract<
    ContentArticle["blocks"][number],
    { type: "h2" }
  >[];
}

export function formatContentDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export { BLOG_ARTICLES, GUIDE_ARTICLES };
