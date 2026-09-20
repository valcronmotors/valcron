import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { Reveal } from "@/components/shared/Reveal";
import { whatsappHref } from "@/lib/site";

export function HomeWhatsAppCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_58%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
        <Reveal>
          <p className="kicker">Asesoría</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            ¿Buscando tu próximo vehículo?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/58">
            Cuéntanos qué marca, modelo y presupuesto tienes en mente.
          </p>
          <a
            href={whatsappHref(
              "Hola, estoy buscando un vehículo. Marca, modelo y presupuesto: ",
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp mx-auto mt-8"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Hablar con un asesor
          </a>
        </Reveal>
      </div>
    </section>
  );
}
