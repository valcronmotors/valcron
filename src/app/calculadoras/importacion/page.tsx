import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageContainer } from "@/components/public/layout";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Calculadora de importación",
  description: `Estima partidas ilustrativas de importación con ${SITE.shortName}. No es un cálculo oficial.`,
  path: "/calculadoras/importacion",
});

export default function CalculadoraImportacionPage() {
  return (
    <main>
      <section className="section-light bg-white pb-4 pt-6 md:pt-8">
        <PageContainer>
          <h1 className="text-2xl font-bold tracking-tight text-[#08090b] md:text-3xl">
            Importación
          </h1>
          <p className="mt-2 text-sm text-[#676a70]">
            Calcula el costo de tu vehículo puesto en RD.
          </p>
        </PageContainer>
      </section>
      <section className="section-light bg-white pb-8">
        <PageContainer>
          <h2 className="mb-4 text-xl font-bold text-[#08090b]">
            Calcula tu presupuesto
          </h2>
          <ImportCostCalculator />
        </PageContainer>
      </section>
    </main>
  );
}
