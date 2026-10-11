import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { SITE, whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return <Section className="section-light bg-white" tight><PageContainer wide>
    <div className="relative overflow-hidden rounded-[2rem] bg-[#f47735] px-6 py-10 sm:px-10 md:grid md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10 lg:px-14 lg:py-14">
      <div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#482008]">Más opciones. Más cerca de ti.</p><h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-[#23150e] sm:text-4xl">¿Tienes un vehículo<br />en mente?</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-[#482008]">Cuéntanos el modelo y tu presupuesto. Empecemos por lo que tú necesitas.</p></div>
      <div className="mt-7 flex flex-col items-start gap-3 md:mt-0 md:items-end"><a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="home-outline-button border-transparent bg-[#17191d] !text-white hover:!bg-[#30333a]">Hablar con Valcron <ArrowRight className="h-4 w-4" aria-hidden="true" /></a><Link href="/solicitar-vehiculo" className="min-h-11 py-3 text-sm font-semibold text-[#23150e] underline underline-offset-4">Enviar mi solicitud</Link><p className="text-xs text-[#482008]">{SITE.address.city} · {SITE.whatsappDisplay}</p></div>
    </div>
  </PageContainer></Section>;
}
