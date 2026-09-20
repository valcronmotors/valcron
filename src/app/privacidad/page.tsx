import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.legalName}.`,
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <ContentPage kicker="Legal" title="Privacidad">
      <p>
        Los datos del formulario de contacto (nombre, teléfono, correo y VIN) se usan para
        atender tu solicitud comercial y entran al CRM interno de {SITE.name}.
      </p>
      <p>
        No vendemos tu información. Puedes pedir actualización o eliminación por WhatsApp al{" "}
        {SITE.whatsappDisplay} o llamando a la oficina {SITE.officePhoneDisplay}.
      </p>
    </ContentPage>
  );
}
