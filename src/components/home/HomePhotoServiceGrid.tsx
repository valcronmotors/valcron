import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

const SERVICES = [
  {
    title: "Comprar",
    copy: "Encuentra tu próximo vehículo.",
    href: "/inventario",
    image: EDITORIAL.citySuv,
  },
  {
    title: "Subastas",
    copy: "Explora oportunidades en Estados Unidos.",
    href: "/subastas",
    image: EDITORIAL.processBrowse,
  },
  {
    title: "Importación",
    copy: "Coordinamos tu importación.",
    href: "/importacion",
    image: EDITORIAL.processImport,
  },
  {
    title: "Financiamiento",
    copy: "Conoce tus opciones.",
    href: "/financiamiento",
    image: EDITORIAL.processFinance,
  },
] as const;

/** Premium photographic service grid — short copy, distinct licensed imagery. */
export function HomePhotoServiceGrid() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
          {SERVICES.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="group relative block overflow-hidden border border-[#e4e6ea] bg-[#08090b] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(8,9,11,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/11]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 560px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#08090b]/88 via-[#08090b]/35 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-white/85">{item.copy}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
                      Ver más
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
