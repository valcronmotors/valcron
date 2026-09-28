import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return (
    <section className="relative isolate min-h-[52svh] overflow-hidden bg-[#090a0b] md:min-h-[62vh]">
      <EditorialImage
        src={EDITORIAL.crossover.src}
        alt={EDITORIAL.crossover.alt}
        sizes="100vw"
        className="object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-[#090a0b]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090a0b]/80 via-[#090a0b]/35 to-transparent" />
      <div className="hero-on-dark relative mx-auto flex min-h-[52svh] max-w-7xl items-end px-4 py-14 md:min-h-[62vh] md:px-8 md:py-24">
        <div className="max-w-2xl">
          <div className="mb-5 h-px w-14 bg-[#c7a96b]" />
          <h2 className="display-section text-white">
            Tu próximo vehículo
            <span className="block">puede empezar aquí.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Explora el inventario o cuéntanos qué buscas. Te orientamos en la compra y el
            financiamiento con bancos locales.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/inventario" className="btn-primary">
              Ver inventario
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
