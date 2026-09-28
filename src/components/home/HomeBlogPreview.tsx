import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { HOME_ARTICLES } from "@/lib/home-content";

export function HomeBlogPreview() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">Recursos</p>
            <h2 className="display-section mt-3 text-[#111214]">
              Antes de comprar,
              <span className="block">conoce lo importante.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#676a70]">
              Guías y artículos para entender inventario, financiamiento, títulos y costos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="btn-secondary">
              Ver blog
            </Link>
            <Link href="/guias" className="btn-secondary">
              Ver guías
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {HOME_ARTICLES.map((article, index) => (
            <Link
              key={article.title}
              href={article.href}
              className="group block border-t border-[#e5e3de] pt-6 transition-opacity duration-180 hover:opacity-90"
            >
              {index === 0 ? (
                <div
                  className="relative mb-6 aspect-[16/10] overflow-hidden bg-[#1b1d20]"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EditorialImage
                    src={article.image.src}
                    alt={article.image.alt}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                  />
                </div>
              ) : (
                <div
                  className="relative mb-6 aspect-[16/10] overflow-hidden bg-[#1b1d20] md:aspect-[16/9]"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EditorialImage
                    src={article.image.src}
                    alt={article.image.alt}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                  />
                </div>
              )}
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9b793f]">
                {article.category}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[#111214] md:text-2xl">
                {article.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
