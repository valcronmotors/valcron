import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";

export function HomeFinalCta() {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.coastal.src}
        alt={EDITORIAL.coastal.alt}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Tu próximo vehículo
          <span className="block">puede empezar aquí.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base text-white/65">
          Dinos qué estás buscando y te ayudamos a explorar tus opciones.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contacto" className="btn-primary">
            Solicitar un Vehículo
          </Link>
          <a
            href={whatsappHref(
              "Hola, estoy buscando un vehículo. Marca, modelo y presupuesto: ",
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
