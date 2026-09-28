import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

export function HomeFinance() {
  return (
    <Section className="section-light bg-white" tight>
      <PageContainer>
        <div
          className="overflow-hidden border border-[#e4e6ea] bg-[#f5f6f7]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-[var(--card-padding)] md:p-10 lg:p-12">
              <p className="kicker">Financiamiento</p>
              <h2 className="display-lg mt-3 text-[#08090b]">
                Financiamiento
                <span className="block">con bancos locales.</span>
              </h2>
              <p className="mt-4 max-w-md text-[length:var(--text-body-lg)] leading-[1.55] text-[#676a70]">
                Te orientamos durante el proceso con instituciones financieras locales. La
                aprobación y las condiciones las define cada banco según tu perfil.
              </p>
              <p className="mt-3 text-sm text-[#676a70]">
                Valcron Motors no es un banco. No prometemos aprobación.
              </p>
              <Link href="/financiamiento" className="btn-primary mt-8">
                Conocer opciones
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-[#e4e6ea] bg-white p-5 md:gap-4 md:p-8 lg:border-l lg:border-t-0">
              {[
                { value: "Inicial", label: "Calcula el aporte inicial" },
                { value: "Plazo", label: "Compara meses estimados" },
                { value: "Cuota", label: "Simula pago mensual" },
                { value: "Banco", label: "La decisión es del banco" },
              ].map((item) => (
                <div
                  key={item.value}
                  className="border border-[#e4e6ea] bg-[#f5f6f7] p-4 md:p-5"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <p className="font-display text-xl font-bold text-[#2b6cff] md:text-2xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-[#676a70]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
