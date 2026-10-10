import { MapPin, MessageCircle } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { LazyMapEmbed } from "@/components/public/LazyMapEmbed";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { mapsDirectionsUrl, SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Contacto en Santo Domingo Este",
    description: `Visítanos en Av Principal 20, Santo Domingo Este, o escríbenos por WhatsApp al ${SITE.whatsappDisplay}.`,
    path: "/contacto",
  }),
};

export default function ContactoPage() {
  const whatsapp = whatsappHref("Hola, quiero información de Valcron Motors.");

  return (
    <main>
      <Section className="section-light bg-white !pb-8 !pt-12 md:!pb-10 md:!pt-16">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl lg:text-[2.75rem]">
              Estamos aquí para ayudarte.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#3B3B3B] md:text-lg">
              Visítanos en Santo Domingo Este o escríbenos por WhatsApp.
            </p>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#F5F5F5] !py-10 md:!py-12">
        <PageContainer>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            <div className="border border-[#E5E7EB] bg-white p-5 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center border border-[#E5E7EB] text-[#111111]">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                Ubicación
              </h2>
              <address className="mt-2 not-italic text-sm leading-relaxed text-[#111111]">
                <p>{SITE.address.street}</p>
                <p>{SITE.address.city}</p>
                <p>{SITE.address.country}</p>
              </address>
            </div>

            <div className="border border-[#E5E7EB] bg-white p-5 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center border border-[#E5E7EB] text-[#111111]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                WhatsApp
              </h2>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
              >
                {SITE.whatsappDisplay}
              </a>
            </div>

            <div className="border border-[#E5E7EB] bg-white p-5 md:p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                Redes sociales
              </h2>
              <SocialLinks className="mt-4" tone="light" />
            </div>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-white !py-10 md:!py-12">
        <PageContainer>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold tracking-tight text-[#111111] md:text-2xl">
                Cómo llegar
              </h2>
              <p className="mt-2 text-sm text-[#3B3B3B]">
                Av Principal 20, Santo Domingo Este.
              </p>
            </div>
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto"
            >
              Cómo llegar →
            </a>
          </div>
          <div className="mt-6 overflow-hidden border border-[#E5E7EB]">
            <div className="h-[220px] w-full min-w-0 sm:h-[280px] lg:h-[340px]">
              <LazyMapEmbed className="h-full w-full" />
            </div>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#F5F5F5] !py-12 md:!py-14">
        <PageContainer>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex h-12 min-w-[16rem] items-center justify-center gap-2 px-8 text-sm font-semibold"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
