import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies",
};

export default function CookiesPage() {
  return (
    <ContentPage kicker="Legal" title="Cookies">
      <p>
        El sitio de {SITE.name} utiliza cookies técnicas necesarias para el funcionamiento de la
        navegación, la sesión y la presentación del inventario público.
      </p>
      <p>
        No utilizamos estas cookies para vender tu información. Puedes gestionar o bloquear cookies
        desde la configuración de tu navegador. Si tienes preguntas, escríbenos a {SITE.email}.
      </p>
    </ContentPage>
  );
}
