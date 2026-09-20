export type ContentKind = "blog" | "guide";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title?: string; text: string };

export type ContentArticle = {
  kind: ContentKind;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  excerpt: string;
  hero: { src: string; alt: string };
  blocks: ContentBlock[];
  faq?: { question: string; answer: string }[];
  related: { kind: ContentKind; slug: string }[];
  cta: { href: string; label: string };
};
