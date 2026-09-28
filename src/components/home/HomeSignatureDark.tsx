import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

const PATHS = [
  {
    title: "Inventario local",
    copy: "Unidades publicadas para compra en República Dominicana.",
    href: "/inventario",
  },
  {
    title: "Subastas",
    copy: "Más opciones en plataformas como Copart e IAA.",
    href: "/subastas",
  },
  {
    title: "Importación",
    copy: "Orientación en selección, compra y proceso de llegada.",
    href: "/importacion",
  },
  {
    title: "Financiamiento",
    copy: "Guía con bancos locales. La aprobación es del banco.",
    href: "/financiamiento",
  },
] as const;

export function HomeSignatureDark() {
  return (
    <Section className="section-dark">
      <PageContainer>
        <div className="mx-auto max-w-[38rem] text-center">
          <p className="kicker">Más formas</p>
          <h2 className="display-lg mt-4 text-balance text-white">
            Más formas de
            <span className="block">encontrar tu vehículo.</span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {["Más opciones", "Proceso claro", "Apoyo local", "Mejor decisión"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#2b6cff] px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mx-auto mt-12 max-w-[40rem] overflow-hidden border border-white/12"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          {PATHS.map((path, index) => (
            <Link
              key={path.href}
              href={path.href}
              className={`block px-5 py-6 transition-colors hover:bg-white/[0.04] md:px-7 ${
                index > 0 ? "border-t border-white/10" : ""
              }`}
            >
              <h3 className="font-display text-xl font-semibold text-white md:text-2xl">
                {path.title}
              </h3>
              <p className="mt-2 text-base text-white/65">{path.copy}</p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
