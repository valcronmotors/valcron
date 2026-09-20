import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Términos y condiciones",
  description: `Términos y condiciones de uso del sitio de ${SITE.legalName}.`,
  path: "/terminos",
});

export default function TerminosPage() {
  return (
    <ContentPage kicker="Legal" title="Términos y Condiciones">
      <p>
        Las cotizaciones, reservas e importaciones se confirman por escrito. Los costos de
        subasta, flete, aduanas e impuestos DGA se detallan caso por caso.
      </p>
      <p>
        {SITE.name} no garantiza tiempos de embarque controlados por navieras o aduanas. Toda
        transacción se rige por las leyes de la República Dominicana.
      </p>
    </ContentPage>
  );
}
