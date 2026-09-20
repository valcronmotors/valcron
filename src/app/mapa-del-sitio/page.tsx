import Link from "next/link";
import { ContentPage } from "@/components/public/ContentPage";
import {
  FOOTER_COMPANY,
  FOOTER_INVENTORY,
  FOOTER_RESOURCES,
  FOOTER_SERVICES,
  LEGAL_NAV,
  PUBLIC_NAV,
} from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Mapa del sitio",
  description: "Navegación pública de Valcron Motors: inventario, servicios, recursos y contacto.",
  path: "/mapa-del-sitio",
});

const GROUPS = [
  { title: "Principal", items: PUBLIC_NAV },
  { title: "Inventario", items: FOOTER_INVENTORY },
  { title: "Servicios", items: FOOTER_SERVICES },
  { title: "Recursos", items: FOOTER_RESOURCES },
  { title: "Empresa", items: FOOTER_COMPANY },
  { title: "Legal", items: LEGAL_NAV },
];

export default function MapaDelSitioPage() {
  return (
    <ContentPage kicker="Navegación" title="Mapa del sitio">
      <div className="grid gap-8">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="font-display text-xl font-semibold text-foreground">{group.title}</h2>
            <ul className="mt-3 grid gap-2">
              {group.items.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href} className="text-foreground underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
