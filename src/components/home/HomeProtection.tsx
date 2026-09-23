import { EditorialImage } from "@/components/shared/EditorialImage";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";

const INSURANCE_WHATSAPP = whatsappHref(
  "Hola, quiero orientación sobre opciones de seguro o cobertura para un vehículo con Valcron Motors.",
);
const WARRANTY_WHATSAPP = whatsappHref(
  "Hola, quiero consultar opciones de garantía o protección para un vehículo elegible con Valcron Motors.",
);

export function HomeProtection() {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <article className="overflow-hidden rounded-[1.5rem] border border-[#ececea] bg-[#faf9f6]">
          <div className="relative aspect-[16/10]">
            <EditorialImage
              src={EDITORIAL.citySuv.src}
              alt={EDITORIAL.citySuv.alt}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <p className="kicker">Seguro</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">
              Protege tu vehículo desde el primer día.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#525252]">
              Te orientamos durante el proceso para gestionar la cobertura adecuada para tu
              vehículo, incluyendo opciones de cobertura full cover cuando corresponda. No somos
              aseguradora: la cobertura la define cada compañía según sus condiciones.
            </p>
            <a href={INSURANCE_WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary mt-6">
              Consultar opciones
            </a>
          </div>
        </article>
        <article className="overflow-hidden rounded-[1.5rem] border border-[#ececea] bg-[#faf9f6]">
          <div className="relative aspect-[16/10]">
            <EditorialImage
              src={EDITORIAL.familySedan.src}
              alt={EDITORIAL.familySedan.alt}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <p className="kicker">Garantía / protección</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">
              Más tranquilidad después de tu compra.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#525252]">
              Consulta las opciones de garantía o protección disponibles para los vehículos
              elegibles. No todas las unidades incluyen cobertura. Condiciones, vigencia y alcance
              se confirman caso por caso.
            </p>
            <a href={WARRANTY_WHATSAPP} target="_blank" rel="noreferrer" className="btn-secondary mt-6">
              Conocer opciones
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
