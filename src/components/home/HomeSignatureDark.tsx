import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

const PATHS = [
  { title: "Inventario", href: "/inventario" },
  { title: "Subastas", href: "/subastas" },
  { title: "Importación", href: "/importacion" },
  { title: "Financiamiento", href: "/financiamiento" },
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
        <div className="mx-auto mt-10 grid max-w-[40rem] gap-3 sm:grid-cols-2">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="border border-white/12 px-5 py-5 text-center font-display text-lg font-semibold text-white transition-colors hover:bg-white/[0.04]"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {path.title}
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
