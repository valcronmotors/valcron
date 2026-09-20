import { ContentListing } from "@/components/content/ContentListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Guías para importar y comprar vehículos",
  description:
    "Guías paso a paso de Valcron Motors: importar un vehículo a República Dominicana, comprar en subastas de Estados Unidos, leer fichas Copart o IAA, calcular costos, VIN y checklist de usados.",
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
