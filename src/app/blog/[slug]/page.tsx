import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { getArticle, listArticles } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listArticles("blog").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("blog", slug);
  if (!article) return { title: "Artículo" };
  return publicPageMetadata({
    title: article.seoTitle,
    description: article.description,
    path: `/blog/${article.slug}`,
    type: "article",
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("blog", slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
