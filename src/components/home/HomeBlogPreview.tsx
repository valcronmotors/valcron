import Link from "next/link";
import { HOME_ARTICLES } from "@/lib/home-content";

export function HomeBlogPreview() {
  return (
    <section className="bg-[#f5f5f5] text-[#111111]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-[#737373]">Recursos</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Aprende antes
              <span className="block">de comprar.</span>
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#111111]">
            Ver Centro de Recursos
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOME_ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="rounded-[1.5rem] border border-[#e5e5e5] bg-white p-6 transition hover:-translate-y-1"
            >
              <p className="kicker">{article.category}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold">{article.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525252]">{article.excerpt}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[#737373]">
                {article.date} · {article.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
