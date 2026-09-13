import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
};

export default function PrivacidadPage() {
  return (
    <ContentPage kicker="Legal" title="Privacidad">
      <p>
        Los datos del formulario de contacto (nombre, teléfono, correo y VIN) se usan para
        atender tu solicitud comercial y entran al CRM interno de {SITE.name}.
      </p>
      <p>
        No vendemos tu información. Puedes pedir actualización o eliminación escribiendo a{" "}
        {SITE.email}.
      </p>
    </ContentPage>
  );
}
