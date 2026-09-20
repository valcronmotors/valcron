import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Políticas de uso",
  description: `Políticas de uso del sitio de ${SITE.legalName}.`,
  path: "/politicas",
});

export default function PoliticasPage() {
  return (
    <ContentPage kicker="Legal" title="Políticas de Uso">
      <p>
        El sitio de {SITE.name} publica inventario y contenidos informativos sobre venta local,
        financiamiento e importación. Los precios y disponibilidad se actualizan desde nuestro
        sistema y pueden cambiar sin previo aviso.
      </p>
      <p>
        El acceso interno está reservado al personal autorizado. El uso indebido de formularios
        o datos de contacto puede ser bloqueado.
      </p>
    </ContentPage>
  );
}
