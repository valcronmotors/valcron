import { PageContainer, Section } from "@/components/public/layout";
import { MessageCircle, Route, Search, MapPin } from "lucide-react";

const TRUST_POINTS = [
  {
    title: "Atención personalizada",
    copy: "Comunicación directa para entender qué buscas y cómo podemos ayudarte.",
    Icon: MessageCircle,
  },
  {
    title: "Proceso transparente",
    copy: "Pasos claros desde la consulta hasta la entrega, sin promesas genéricas.",
    Icon: Route,
  },
  {
    title: "Variedad de origen",
    copy: "Inventario local, búsqueda a medida y oportunidades de subasta cuando aplica.",
    Icon: Search,
  },
  {
    title: "En Santo Domingo Este",
    copy: "Operamos en República Dominicana con la información de contacto publicada en el sitio.",
    Icon: MapPin,
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
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
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
