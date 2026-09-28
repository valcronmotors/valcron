import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { QuoteForm } from "@/components/public/QuoteForm";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Solicitar vehículo",
  description:
    "Cuéntanos qué vehículo buscas. Valcron Motors revisa inventario, subastas e importación según tu presupuesto. Santo Domingo Este.",
  path: "/solicitar-vehiculo",
});

export default function SolicitarVehiculoPage() {
  return (
    <main>
      <Section className="section-light bg-white" tight>
        <PageContainer narrow>
          <SectionHeader
            align="center"
            kicker="Búsqueda personalizada"
            title="Solicitar vehículo"
            subtitle="Marca, modelo, año, presupuesto y cualquier detalle que nos ayude a orientarte. Revisamos inventario y otras fuentes cuando aplica."
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref("Hola, quiero solicitar una búsqueda de vehículo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <Link href="/inventario" className="btn-secondary w-full sm:w-auto">
              Ver inventario
            </Link>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f5f6f7]">
        <PageContainer narrow>
          <QuoteForm
            showVehicleInterest
            submitLabel="Enviar solicitud"
            defaultMessage="Marca, modelo, año aproximado, presupuesto y preferencias:"
          />
          <p className="mt-6 text-center text-sm text-[#676a70]">
            También puedes visitarnos en {SITE.address.street}, {SITE.address.city}.
          </p>
        </PageContainer>
      </Section>
    </main>
  );
}
