import Link from "next/link";
import { Suspense } from "react";
import { PageContainer, Section, SectionHeader } from "@/components/public/layout";
import { PageHero } from "@/components/public/PageHero";
import { CatalogSkeleton } from "@/components/public/InventorySkeleton";
import { VehicleCatalog, type CatalogFilters } from "@/components/public/VehicleCatalog";
import { VisualStepSequence } from "@/components/public/VisualStory";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { EDITORIAL } from "@/lib/editorial-media";
import { loadAuctionCatalogVehicles } from "@/lib/public-inventory";
import { SITE, whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Oportunidades de subasta desde Estados Unidos",
  description:
    "Vehículos seleccionados por Valcron en plataformas de subasta de EE.UU. (Copart e IAA). Cotización clara. Santo Domingo Este.",
  path: "/subastas",
});

const STEPS = [
  {
    step: "01",
    title: "Dinos qué vehículo buscas",
    copy: "Marca, modelo, año y presupuesto.",
    image: {
      src: EDITORIAL.processSearch.src,
      alt: EDITORIAL.processSearch.alt,
      caption: EDITORIAL.processSearch.caption,
    },
  },
  {
    step: "02",
    title: "Revisamos opciones disponibles",
    copy: "Lotes publicados en plataformas de mercado.",
    image: {
      src: EDITORIAL.processBrowse.src,
      alt: EDITORIAL.processBrowse.alt,
      caption: EDITORIAL.processBrowse.caption,
    },
  },
  {
    step: "03",
    title: "Preparamos la cotización",
    copy: "Costos y pasos antes de avanzar.",
    image: {
      src: EDITORIAL.processQuote.src,
      alt: EDITORIAL.processQuote.alt,
      caption: EDITORIAL.processQuote.caption,
    },
  },
  {
    step: "04",
    title: "Seleccionas la unidad",
    copy: "Tú decides con información clara.",
    image: {
      src: EDITORIAL.processSelect.src,
      alt: EDITORIAL.processSelect.alt,
      caption: EDITORIAL.processSelect.caption,
    },
  },
  {
    step: "05",
    title: "Coordinamos el proceso contratado",
    copy: "Logística y cierre según lo acordado.",
    image: {
      src: EDITORIAL.processLogistics.src,
      alt: EDITORIAL.processLogistics.alt,
      caption: EDITORIAL.processLogistics.caption,
    },
  },
] as const;

const PLATFORMS = [
  {
    name: "Copart",
    copy: "Publicaciones y fotos de lote. Fuente de mercado, no socio.",
  },
  {
    name: "IAA",
    copy: "Otra plataforma de subasta. Revisamos datos antes de avanzar.",
  },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

async function AuctionMarketplace({
  searchParams,
}: {
  searchParams: Promise<{
    marca?: string;
    modelo?: string;
    ano?: string;
    precioMin?: string;
    precioMax?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const inventory = await loadAuctionCatalogVehicles();
  const filters: CatalogFilters = {
    listing: "auction",
    marca: firstParam(params.marca),
    modelo: firstParam(params.modelo),
    ano: firstParam(params.ano),
    precioMin: firstParam(params.precioMin),
    precioMax: firstParam(params.precioMax),
    search: firstParam(params.q),
  };

  return (
    <VehicleCatalog
      catalogKind="auction"
      basePath="/subastas"
      initialVehicles={inventory.data}
      initialError={inventory.error}
      initialFilters={filters}
    />
  );
}

export default function SubastasPage({
  searchParams,
}: {
  searchParams: Promise<{
    marca?: string;
    modelo?: string;
    ano?: string;
    precioMin?: string;
    precioMax?: string;
    q?: string;
  }>;
}) {
  return (
    <main>
      <PageHero
        kicker="Oportunidades de subasta"
        title="Más opciones seleccionadas por Valcron"
        subtitle="Vehículos seleccionados por Valcron en plataformas de subasta de Estados Unidos."
      />

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader
            kicker="Marketplace"
            title="Oportunidades publicadas"
            subtitle="Solo unidades revisadas y publicadas por Valcron. No es el catálogo completo de Copart."
          />
          <div className="mt-6">
            <Suspense fallback={<CatalogSkeleton />}>
              <AuctionMarketplace searchParams={searchParams} />
            </Suspense>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-white" tight>
        <PageContainer>
          <SectionHeader
            kicker="Proceso visual"
            title="De la búsqueda al cierre"
            subtitle="Así te acompañamos, paso a paso."
          />
          <VisualStepSequence steps={STEPS} tone="light" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/solicitar-vehiculo" className="btn-primary">
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref("Hola, quiero información sobre oportunidades de subasta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </PageContainer>
      </Section>

      <Section className="section-light bg-[#f7f8fa]" tight>
        <PageContainer>
          <SectionHeader
            kicker="Plataformas"
            title="Copart e IAA como referencia"
            subtitle={`${SITE.shortName} no es socio, partner ni afiliado de esas compañías.`}
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {PLATFORMS.map((item) => (
              <article
                key={item.name}
                className="border border-[#e4e6ea] bg-white p-5 md:p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <p className="kicker !text-[#676a70]">Plataforma</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[#08090b]">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#676a70]">{item.copy}</p>
              </article>
            ))}
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}
