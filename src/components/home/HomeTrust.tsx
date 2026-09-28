import { PageContainer, Section, SectionHeader } from "@/components/public/layout";

const ITEMS = [
  {
    step: "01",
    title: "Atención personalizada",
    copy: "Trato directo para entender qué buscas y qué opciones tienen sentido.",
  },
  {
    step: "02",
    title: "Más opciones",
    copy: "Inventario local y, cuando hace falta, búsqueda, subasta e importación.",
  },
  {
    step: "03",
    title: "Proceso claro",
    copy: "Pasos cortos, sin tecnicismos innecesarios ni promesas vacías.",
  },
  {
    step: "04",
    title: "Presencia local",
    copy: "Santo Domingo Este. Oficina, WhatsApp y acompañamiento real.",
  },
] as const;

export function HomeTrust() {
  return (
    <Section className="section-light bg-[#f5f6f7]" tight>
      <PageContainer>
        <SectionHeader
          kicker="Por qué Valcron"
          title={
            <>
              Claridad primero.
              <span className="block">Proceso después.</span>
            </>
          }
          align="center"
        />
        <div className="mx-auto mt-10 grid max-w-[52rem] gap-3 sm:grid-cols-2 md:mt-12 md:gap-4">
          {ITEMS.map((item, index) => (
            <article
              key={item.step}
              className={`border border-[#e4e6ea] bg-white p-5 md:p-6 ${
                index === 1 || index === 2 ? "sm:translate-y-2" : ""
              }`}
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <p className="font-display text-sm font-bold tracking-[0.16em] text-[#2b6cff]">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[#08090b]">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[#676a70]">{item.copy}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
