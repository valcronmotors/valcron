import { ContentListing } from "@/components/content/ContentListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Blog automotriz",
  description:
    "Artículos de Valcron Motors sobre importar vehículos a República Dominicana, subastas de Estados Unidos, títulos, híbridos y compra informada en Santo Domingo Este.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <ContentListing kind="blog" />
    </>
  );
}
