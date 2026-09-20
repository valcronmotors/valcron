import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { HOME_ARTICLES } from "@/lib/home-content";

export function HomeBlogPreview() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">Recursos</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
              Aprende antes
              <span className="block">de comprar.</span>
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#111]">
            Ver Centro de Recursos
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOME_ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="overflow-hidden rounded-[1.35rem] border border-[#ececea] bg-[#faf9f6] transition hover:-translate-y-1 hover:border-[#C7A96B]/40"
            >
              <div className="relative aspect-[16/10]">
                <EditorialImage
                  src={article.image.src}
                  alt={article.image.alt}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="kicker">{article.category}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-[#111]">{article.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#525252]">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
