import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Cookies",
  description: `Información sobre cookies técnicas en el sitio de ${SITE.legalName}.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <ContentPage kicker="Legal" title="Cookies">
      <p>
        El sitio de {SITE.name} utiliza cookies técnicas necesarias para el funcionamiento de la
        navegación, la sesión y la presentación del inventario público.
      </p>
      <p>
        No utilizamos estas cookies para vender tu información. Puedes gestionar o bloquear cookies
        desde la configuración de tu navegador. Si tienes preguntas, contáctanos por WhatsApp al{" "}
        {SITE.whatsappDisplay} o llama a la oficina {SITE.officePhoneDisplay}.
      </p>
    </ContentPage>
  );
}
