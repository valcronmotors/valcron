import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { HOME_CARRIER_IMAGE, HOME_CONSULT_IMAGE } from "@/lib/hero-media";

const CARDS = [
  {
    href: "/financiamiento",
    kicker: "Financiamiento",
    title: "Opciones con bancos locales.",
    copy: "Orientación clara. La aprobación la define cada institución.",
    cta: "Conocer opciones",
    image: HOME_CONSULT_IMAGE,
  },
  {
    href: "/importacion",
    kicker: "Importación",
    title: "Coordinamos tu importación.",
    copy: "Transporte y llegada confirmados para tu caso.",
    cta: "Ver importación",
    image: HOME_CARRIER_IMAGE,
  },
] as const;

/** Compact service highlights — details stay on dedicated pages. */
export function HomeFinancingTeaser() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer wide>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group relative flex min-h-[15rem] flex-col overflow-hidden border border-[#E5E7EB] sm:min-h-[16.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
              >
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 48vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#111111]/92 via-[#111111]/50 to-[#111111]/20"
                  aria-hidden="true"
                />
                <span className="relative z-[1] mt-auto flex flex-col items-center px-5 py-7 text-center sm:px-7">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {card.kicker}
                  </span>
                  <span className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {card.title}
                  </span>
                  <span className="mt-2 max-w-[28rem] text-sm leading-relaxed text-white/85">{card.copy}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111111]">
                    {card.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
