import { ContentListing } from "@/components/content/ContentListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Guías para Comprar e Importar Vehículos",
  description:
    "Guías de Valcron Motors para comprar un vehículo, entender financiamiento, subastas e importación a República Dominicana.",
  path: "/guias",
});

export default function GuiasPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Guías", path: "/guias" },
        ])}
      />
      <ContentListing kind="guide" />
    </>
  );
}
