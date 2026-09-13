import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de Uso",
};

export default function PoliticasPage() {
  return (
    <ContentPage kicker="Legal" title="Políticas de Uso">
      <p>
        El sitio de {SITE.name} publica inventario y contenidos informativos sobre venta local,
        financiamiento e importación. Los precios y disponibilidad se actualizan desde nuestro
        sistema y pueden cambiar sin previo aviso.
      </p>
      <p>
        El acceso ERP/CRM está reservado al personal autorizado. El uso indebido de formularios
        o datos de contacto puede ser bloqueado.
      </p>
    </ContentPage>
  );
}
