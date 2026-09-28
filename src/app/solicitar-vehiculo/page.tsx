import Link from "next/link";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { QuoteForm } from "@/components/public/QuoteForm";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Solicitar vehículo",
  description:
    "Cuéntanos qué buscas. Revisamos inventario, subastas e importación según tu presupuesto.",
  path: "/solicitar-vehiculo",
});

export default function SolicitarVehiculoPage() {
  return (
    <main className="section-light bg-[#f7f8fa]">
      <Section className="bg-white" tight>
        <PageContainer narrow>
          <SectionHeader
            align="center"
            kicker="Búsqueda"
            title="Solicitar vehículo"
            subtitle="Marca, modelo, año y presupuesto. Revisamos opciones en inventario y otras fuentes."
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

      <Section tight>
        <PageContainer narrow>
          <QuoteForm
            showVehicleInterest
            submitLabel="Enviar solicitud"
            defaultMessage="Marca, modelo, año, presupuesto:"
          />
          <p className="mt-6 text-center text-sm text-[#676a70]">
            {SITE.address.street}, {SITE.address.city} · {SITE.officePhoneDisplay}
          </p>
        </PageContainer>
      </Section>
    </main>
  );
}
