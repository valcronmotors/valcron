import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { HOME_CARRIER_IMAGE, HOME_CONSULT_IMAGE } from "@/lib/hero-media";

const CARDS = [
  {
    href: "/financiamiento",
    title: "Financiamiento",
    copy: "Escenarios con bancos locales. Sin aprobación prometida.",
    image: HOME_CONSULT_IMAGE,
  },
  {
    href: "/importacion",
    title: "Importación",
    copy: "Transporte y llegada, confirmados para tu caso.",
    image: HOME_CARRIER_IMAGE,
  },
] as const;

/** Compact service entries. The full process stays on each dedicated page. */
export function HomeFinancingTeaser() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer wide>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group grid overflow-hidden bg-[#f7f8fa] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]"
              >
                <span className="relative block min-h-[10rem] sm:min-h-[14rem]">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 28vw"
                    className="object-cover object-center"
                  />
                </span>
                <span className="flex flex-col justify-center px-5 py-6 sm:px-7">
                  <span className="font-display text-2xl font-bold tracking-tight text-[#08090b]">
                    {card.title}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-[#676a70]">{card.copy}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#08090b]">
                    Conocer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
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
