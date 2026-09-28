import Link from "next/link";
import { Suspense } from "react";
import { FinanceForm } from "@/components/public/FinanceForm";
import { PageHero } from "@/components/public/PageHero";
import { PAGE_HERO_ALTS, PAGE_HERO_IMAGES } from "@/lib/hero-media";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Financiamiento de vehículos con bancos locales",
  description:
    "Orientación de financiamiento con bancos locales en República Dominicana. Calcula escenarios. La aprobación la define cada banco.",
  path: "/financiamiento",
});

const REQUIREMENTS = [
  {
    title: "Persona física asalariada",
    items: [
      "Cédula de identidad y electoral",
      "Carta de trabajo y últimos comprobantes de ingresos",
      "Estados de cuenta o evidencia de capacidad de pago",
      "Referencias y buró crediticio según política de cada banco",
    ],
  },
  {
    title: "Independientes / formalizados",
    items: [
      "Cédula y RNC o evidencia de actividad económica",
      "Declaraciones o estados financieros recientes",
      "Estados de cuenta de los últimos meses",
      "Documentación del vehículo a financiar",
    ],
  },
];

export default function FinanciamientoPage() {
  return (
    <main>
      <PageHero
        kicker="Financiamiento"
        title="Financiamiento con bancos locales"
        subtitle="Te orientamos a organizar tu caso. No prometemos aprobación. Las condiciones las define cada institución financiera."
        image={PAGE_HERO_IMAGES.financiamiento}
        imageAlt={PAGE_HERO_ALTS.financiamiento}
      />

      <section className="section-light bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-3xl">
            <p className="kicker">Cómo funciona</p>
            <h2 className="display-section mt-3 text-[#08090b]">
              Un proceso ordenado, sin atajos.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#676a70]">
              {SITE.shortName} te ayuda a preparar la información de tu compra. No somos un banco.
              Inicial, plazo, tasa y aprobación dependen de cada institución y de tu perfil.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light bg-[#f5f6f7]">
        <div className="mx-auto grid max-w-7xl gap-0 border-y border-[#e4e6ea] px-4 md:grid-cols-2 md:px-8">
          {REQUIREMENTS.map((group) => (
            <article
              key={group.title}
              className="border-b border-[#e4e6ea] py-10 md:border-b-0 md:border-r md:px-8 md:odd:pl-0 md:even:border-r-0 md:even:pr-0"
            >
              <h3 className="font-display text-xl font-semibold text-[#08090b] md:text-2xl">
                {group.title}
              </h3>
              <ul className="mt-5 grid gap-3 text-base text-[#676a70]">
                {group.items.map((item) => (
                  <li key={item} className="border-l-2 border-[#2b6cff] pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-dark bg-[#08090b]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-20">
          <div>
            <p className="kicker text-[#2b6cff]">Simulador</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Calcula escenarios de compra
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Ingresa precio, inicial, tasa y plazo. La cuota es ilustrativa. La aprobación
              definitiva la define cada banco local.
            </p>
            <Link
              href="/calculadoras/financiamiento"
              className="btn-secondary mt-6 inline-flex h-12 border-white/40 text-white md:hidden"
            >
              Abrir calculadora
            </Link>
          </div>
          <div className="hidden md:block">
            <Suspense
              fallback={
                <div className="gloss-panel p-8 text-sm text-white/70">Cargando simulador...</div>
              }
            >
              <FinanceForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
