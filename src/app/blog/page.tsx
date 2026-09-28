import { ContentListing } from "@/components/content/ContentListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Blog Automotriz en RD",
  description:
    "Artículos de Valcron Motors sobre comprar vehículos en República Dominicana, financiamiento, subastas e importación.",
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
