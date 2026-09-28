import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

const PATHS = [
  {
    title: "Inventario",
    href: "/inventario",
    image: EDITORIAL.compactSuv,
    caption: "Unidades publicadas",
  },
  {
    title: "Subastas",
    href: "/subastas",
    image: EDITORIAL.processBrowse,
    caption: EDITORIAL.processBrowse.caption,
  },
  {
    title: "Importación",
    href: "/importacion",
    image: EDITORIAL.processImport,
    caption: EDITORIAL.processImport.caption,
  },
  {
    title: "Financiamiento",
    href: "/financiamiento",
    image: EDITORIAL.processFinance,
    caption: EDITORIAL.processFinance.caption,
  },
] as const;

export function HomeSignatureDark() {
  return (
    <Section className="section-dark" tight>
      <PageContainer>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="display-lg text-balance text-white">
            Más formas de
            <span className="block">encontrar tu vehículo.</span>
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group overflow-hidden border border-white/12 bg-white/[0.03] transition-colors hover:bg-white/[0.06]"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#12141a]">
                <Image
                  src={path.image.src}
                  alt={path.image.alt}
                  fill
                  sizes="(max-width: 768px) 92vw, 25vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-4 py-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                  {path.caption}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{path.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
