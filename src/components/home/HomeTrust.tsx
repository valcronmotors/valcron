import { PageContainer, Section } from "@/components/public/layout";
import { Globe2, Gavel, MessageCircle, Phone, Route } from "lucide-react";

const TRUST_POINTS = [
  {
    title: "Atención personalizada",
    copy: "Comunicación directa para entender qué buscas y cómo podemos ayudarte.",
    Icon: MessageCircle,
  },
  {
    title: "Orientación en compra",
    copy: "Acompañamiento claro desde la consulta hasta la decisión de compra.",
    Icon: Route,
  },
  {
    title: "Opciones de subasta",
    copy: "Oportunidades seleccionadas en Estados Unidos cuando aplican a tu búsqueda.",
    Icon: Gavel,
  },
  {
    title: "Coordinación de importación",
    copy: "Apoyo en el proceso contratado de traer un vehículo a República Dominicana.",
    Icon: Globe2,
  },
  {
    title: "Comunicación directa",
    copy: "Contacto por WhatsApp, teléfono u oficina en Santo Domingo Este.",
    Icon: Phone,
  },
] as const;

export function HomeTrust() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div className="max-w-[36rem] md:max-w-none">
          <p className="kicker !text-[#676a70]">Por qué Valcron</p>
          <h2 className="display-lg mt-2 text-balance text-[#08090b]">
            Compra con información clara
            <span className="block">y acompañamiento real.</span>
          </h2>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-4">
          {TRUST_POINTS.map(({ title, copy, Icon }) => (
            <li key={title}>
              <article
                className="h-full border border-[#e4e6ea] bg-[#f7f8fa] p-5 sm:p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <Icon className="h-6 w-6 text-[#2b6cff]" aria-hidden="true" />
                <h3 className="font-display mt-3 text-base font-bold text-[#08090b]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{copy}</p>
              </article>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
