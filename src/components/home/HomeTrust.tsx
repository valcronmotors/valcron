import { PageContainer, Section } from "@/components/public/layout";

const TRUST_POINTS = [
  {
    title: "Atención personalizada",
    copy: "Comunicación directa para entender qué buscas.",
  },
  {
    title: "Orientación en compra",
    copy: "Acompañamiento claro desde la consulta hasta la decisión.",
  },
  {
    title: "Opciones de subasta",
    copy: "Oportunidades seleccionadas en Estados Unidos cuando aplican.",
  },
  {
    title: "Importación coordinada",
    copy: "Apoyo en el proceso contratado hacia República Dominicana.",
  },
] as const;

/**
 * Factual trust strip — no fabricated reviews, ratings or delivery photos.
 * Hidden customer gallery remains in HomeStories until real assets exist.
 */
export function HomeTrust() {
  return (
    <Section className="section-light bg-[#f7f8fa]" tight>
      <PageContainer>
        <div className="max-w-[32rem]">
          <p className="kicker !text-[#676a70]">Valcron Motors</p>
          <h2 className="display-lg mt-2 text-balance text-[#08090b]">
            Compra con información clara.
          </h2>
        </div>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((item) => (
            <li
              key={item.title}
              className="border border-[#e4e6ea] bg-white px-5 py-5"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <h3 className="font-display text-base font-bold text-[#08090b]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{item.copy}</p>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
