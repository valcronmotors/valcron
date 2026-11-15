import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

export function HomeModelSpotlight() {
  return (
    <Section className="section-light bg-white" id="modelo-destacado" tight>
      <PageContainer wide>
        <div className="grid items-center gap-5 rounded-2xl border border-[#e9ebef] bg-[#f6f7f9] p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8 sm:p-7">
          <Image
            src="/marketing/honda-crv-hybrid-2025.jpg"
            alt="Honda CR-V Sport Touring Hybrid 2025 azul, referencia del fabricante"
            width={735}
            height={368}
            sizes="(max-width: 640px) 90vw, 35vw"
            className="h-auto max-h-48 w-full rounded-xl object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#17191d]">
              Honda CR-V Hybrid 2025
            </h2>
            <p className="mt-2 text-sm text-[#676b73]">
              Un SUV híbrido para tu próxima búsqueda, sujeto a disponibilidad.
            </p>
            <a
              href={whatsappHref(
                "Hola, me interesa solicitar una búsqueda de Honda CR-V Hybrid 2025. Quiero conocer opciones y presupuesto.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="home-orange-button mt-4"
            >
              Buscar este modelo{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
