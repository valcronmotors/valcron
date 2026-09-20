import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { getArticle, listArticles } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listArticles("guide").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("guide", slug);
  if (!article) return { title: "Guía" };
  return publicPageMetadata({
    title: article.seoTitle,
    description: article.description,
    path: `/guias/${article.slug}`,
    type: "article",
  });
}

export default async function GuiaArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("guide", slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
