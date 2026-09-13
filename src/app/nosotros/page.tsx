import { ContentPage } from "@/components/public/ContentPage";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Conoce a ${SITE.name}: dealer, financiamiento e importación directa en Santo Domingo Este.`,
};

export default function NosotrosPage() {
  return (
    <ContentPage kicker={SITE.name} title="Nosotros">
      <p>
        Somos un dealer en Santo Domingo Este dedicado a vender, importar y financiar vehículos
        de marcas confiables, con un servicio personalizado de principio a fin.
      </p>
      <p>
        Operamos subastas Copart y Manheim con licencia de dealer, asesoramos Ley 103-13 y
        acompañamos cada entrega con diagnóstico técnico y transparencia de costos.
      </p>
      <p>
        Visítanos en {SITE.address.full} o escríbenos al WhatsApp {SITE.whatsapp}.
      </p>
    </ContentPage>
  );
}
