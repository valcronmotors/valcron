import { VehiclePhoto } from "@/components/shared/VehiclePhoto";
import Link from "next/link";
import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageContainer, Section } from "@/components/public/layout";
import { loadPublicVehicles } from "@/lib/public-inventory";
import { vehicleImageAlt } from "@/lib/vehicles/vehicle-formatters";
import { whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Importa tu vehículo a República Dominicana",
  description:
    "Importa por encargo con Valcron Motors: búsqueda, compra en subasta, transporte y entrega en RD. Calcula un estimado y solicita tu cotización por WhatsApp.",
  path: "/importacion",
});
const steps = [
  { title: "Elige tu vehículo", text: "Búsqueda y evaluación del lote." },
  { title: "Aprueba tu compra", text: "Presupuesto antes de avanzar." },
  { title: "De EE. UU. a RD", text: "Transporte terrestre y flete marítimo." },
  { title: "Recíbelo en RD", text: "Aduana, primera placa y entrega." },
];
export default async function ImportacionPage() {
  const catalogue = await loadPublicVehicles();
  const vehicles = catalogue.data
    .filter(
      (vehicle) => vehicle.images[0]?.url && vehicle.availability !== "sold",
    )
    .sort(
      (a, b) =>
        Number(b.listingKind === "dealer") - Number(a.listingKind === "dealer"),
    );
  return (
    <main>
      <section className="section-light bg-white pb-4 pt-6 md:pt-8">
        <PageContainer>
          <h1 className="text-2xl font-bold tracking-tight text-[#08090b] md:text-3xl">
            Importación
          </h1>
          <p className="mt-2 text-sm text-[#676a70]">
            Calcula el costo de tu vehículo puesto en RD.
          </p>
        </PageContainer>
      </section>
      <section
        className="section-light scroll-mt-24 bg-white pb-8"
        id="estimador"
      >
        <PageContainer>
          <h2 className="mb-4 text-xl font-bold text-[#08090b]">
            Calcula tu presupuesto
          </h2>
          <ImportCostCalculator />
          <Link
            href="/solicitar-vehiculo"
            className="mt-4 inline-flex min-h-12 items-center font-semibold text-[#a54d1c] underline underline-offset-4"
          >
            Prefiero solicitar una cotización
          </Link>
        </PageContainer>
      </section>
      <Section className="section-light bg-[#f5f6f7]" tight>
        <PageContainer>
          <h2 className="text-3xl font-bold text-[#08090b]">
            Cuatro pasos. Un solo equipo.
          </h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const vehicle =
                vehicles[(index + 1) % Math.max(1, vehicles.length)];
              return (
                <li
                  key={step.title}
                  className="overflow-hidden rounded-2xl border border-[#e4e6ea] bg-white"
                >
                  <div className="relative aspect-[4/3]">
                    <VehiclePhoto
                      src={vehicle?.images[0]?.url}
                      alt={
                        vehicle
                          ? vehicleImageAlt(vehicle)
                          : "Vehículo del catálogo Valcron"
                      }
                      sizes="(min-width:1024px) 23vw, (min-width:640px) 45vw, 92vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-[#a54d1c]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-2 font-bold text-[#08090b]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#676a70]">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/subastas"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#08090b] px-5 font-semibold text-white"
            >
              Ver oportunidades de subasta
            </Link>
            <a
              href={whatsappHref(
                "Hola Valcron, quiero importar un vehículo a RD.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8dbe0] bg-white px-5 font-semibold text-[#08090b]"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
