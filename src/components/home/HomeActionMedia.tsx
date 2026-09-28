import Image from "next/image";
import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

/**
 * Editorial media chapter. No playable video until Valcron-owned media exists.
 * Attached mockup/reference recordings must not be published.
 */
export function HomeActionMedia() {
  return (
    <Section className="section-dark" tight>
      <PageContainer>
        <div
          className="relative grid overflow-hidden md:grid-cols-[1.15fr_0.85fr]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="relative aspect-[16/11] min-h-[15rem] bg-[#12141a] md:aspect-auto md:min-h-[20rem]">
            <Image
              src={EDITORIAL.sunsetSuv.src}
              alt={EDITORIAL.sunsetSuv.alt}
              fill
              sizes="(max-width: 768px) 92vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/70 via-[#08090b]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#08090b]/25 md:to-[#08090b]/80" />
          </div>
          <div className="flex flex-col justify-center bg-[#08090b] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
              Valcron en acción
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Más que vehículos,
              <span className="block">experiencias reales.</span>
            </h2>
            <p className="mt-3 max-w-[22rem] text-sm leading-relaxed text-white/70 md:text-base">
              Conoce cómo hacemos posible que más personas manejen su próximo vehículo.
            </p>
            <Link href="/nosotros" className="btn-secondary mt-6 w-fit">
              Conocer Valcron
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
