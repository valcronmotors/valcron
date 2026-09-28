import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

export function HomeTradeIn() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div
          className="mx-auto max-w-[40rem] border border-[#e4e6ea] bg-[#f5f6f7] p-[var(--card-padding)] text-center md:p-10"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <p className="kicker">Trade-in</p>
          <h2 className="display-lg mt-3 text-[#08090b]">
            ¿Tienes un vehículo
            <span className="block">para entregar?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
            Podemos evaluar tu unidad como parte del proceso de compra. El valor se confirma
            después de revisar la unidad — sin tasación prometida por adelantado.
          </p>
          <Link href="/contacto?asunto=trade-in" className="btn-primary mt-8">
            Solicitar evaluación
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
