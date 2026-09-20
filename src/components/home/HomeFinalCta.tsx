import Link from "next/link";
import { EditorialImage } from "@/components/shared/EditorialImage";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";

const POINTS = [
  "Asesoría personalizada",
  "Opciones en EE.UU. y RD",
  "Proceso claro",
  "Acompañamiento",
];

export function HomeFinalCta() {
  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden bg-black">
      <EditorialImage
        src={EDITORIAL.coastal.src}
        alt={EDITORIAL.coastal.alt}
        sizes="100vw"
        className="object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-black/62" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
      <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-end gap-10 px-5 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-5 h-px w-16 bg-[#C7A96B]" />
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Tu próximo vehículo
            <span className="block">puede empezar aquí.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base text-white/70">
            Dinos qué estás buscando y te ayudamos a explorar las opciones disponibles para ti.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-primary">
              Solicitar un vehículo
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="btn-secondary">
              <WhatsAppIcon className="mr-2 h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        <aside className="rounded-[1.35rem] border border-white/12 bg-black/35 p-6 backdrop-blur-md lg:mb-4">
          <p className="kicker">Más que vehículos</p>
          <ul className="mt-5 grid gap-3">
            {POINTS.map((item) => (
              <li key={item} className="border-b border-white/10 pb-3 text-sm text-white/75">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
