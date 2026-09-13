import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guías de importación Copart/Manheim, financiamiento y Ley 103-13 en República Dominicana.",
};

export default function BlogPage() {
  return (
    <ContentPage kicker="Blog" title="Guías para comprar e importar en RD">
      <article>
        <h2 className="font-display text-2xl font-semibold text-foreground">Ley 103-13: incentivo eco</h2>
        <p className="mt-3">
          Antes de importar, evaluamos si la unidad califica al incentivo y qué documentación
          necesitas para el despacho. El ahorro depende del vehículo, no de promesas genéricas.
        </p>
      </article>
      <article>
        <h2 className="font-display text-2xl font-semibold text-foreground">Copart vs Manheim</h2>
        <p className="mt-3">
          Copart concentra inventario de seguro y salvage; Manheim opera dealer-to-dealer. En{" "}
          {SITE.shortName} seleccionamos la fuente según tu presupuesto y el uso real en RD.
        </p>
      </article>
      <article>
        <h2 className="font-display text-2xl font-semibold text-foreground">Financiamiento local</h2>
        <p className="mt-3">
          Estructuramos la compra con banca local tanto para stock en dealer como para unidades
          importadas a tu nombre. Oficina comercial: {SITE.phoneOffice}.
        </p>
      </article>
    </ContentPage>
  );
}
