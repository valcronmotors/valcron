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
          className="relative grid overflow-hidden md:grid-cols-[1.1fr_0.9fr]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="relative aspect-[16/11] min-h-[14rem] bg-[#12141a] md:aspect-auto md:min-h-[18rem]">
            <Image
              src={EDITORIAL.sunsetSuv.src}
              alt={EDITORIAL.sunsetSuv.alt}
              fill
              sizes="(max-width: 768px) 92vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#08090b]/35" />
          </div>
          <div className="flex flex-col justify-center bg-[#08090b] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
              Valcron en acción
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Más que vehículos,
              <span className="block">experiencias reales.</span>
            </h2>
            <Link href="/nosotros" className="btn-primary mt-6 w-fit">
              Conocer Valcron
            </Link>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
