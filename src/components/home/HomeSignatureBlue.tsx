import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";

const STEPS = [
  "Cuéntanos qué buscas.",
  "Evaluamos las opciones.",
  "Coordinamos el proceso.",
] as const;

/** Compact photographic signature — search assistance without guarantees. */
export function HomeSignatureBlue() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <article
          className="overflow-hidden border border-[#e4e6ea] bg-[#08090b]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="grid md:grid-cols-2">
            <div className="relative order-2 aspect-[16/11] md:order-none md:aspect-auto md:min-h-[18rem]">
              <Image
                src={EDITORIAL.processSearch.src}
                alt={EDITORIAL.processSearch.alt}
                fill
                sizes="(max-width: 768px) 92vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6cff]">
                Búsqueda personalizada
              </p>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Lo encontramos contigo
              </h2>
              <p className="mt-3 max-w-[28rem] text-sm leading-relaxed text-white/80">
                Cuéntanos qué vehículo buscas. Te ayudamos a evaluar opciones.
              </p>
              <ol className="mt-5 space-y-2 text-sm text-white/90">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex gap-2.5">
                    <span className="tabular-nums font-semibold text-[#2b6cff]">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <Link
                  href="/solicitar-vehiculo"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#2b6cff] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1f5ae6]"
                >
                  Solicitar vehículo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </PageContainer>
    </Section>
  );
}
