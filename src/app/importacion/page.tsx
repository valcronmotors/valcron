import Image from "next/image";
import Link from "next/link";
import { ImportCostCalculator } from "@/components/public/ImportCostCalculator";
import { PageContainer, Section } from "@/components/public/layout";
import { EDITORIAL } from "@/lib/editorial-media";
import { whatsappHref } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Importa tu vehículo a República Dominicana",
  description: "Importa por encargo con Valcron Motors: búsqueda, compra en subasta, transporte y entrega en RD. Calcula un estimado y solicita tu cotización por WhatsApp.",
  path: "/importacion",
});
const steps = [
  { title: "Elige tu vehículo", text: "Búsqueda y evaluación del lote.", image: EDITORIAL.processSelect },
  { title: "Aprueba tu compra", text: "Presupuesto antes de avanzar.", image: EDITORIAL.processQuote },
  { title: "De EE. UU. a RD", text: "Transporte terrestre y flete marítimo.", image: EDITORIAL.processImport },
  { title: "Recíbelo en RD", text: "Aduana, primera placa y entrega.", image: EDITORIAL.processDelivery },
];
export default function ImportacionPage() {
  return <main>
    <section className="section-light bg-white py-10 md:py-16"><PageContainer>
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a54d1c]">Importación por encargo</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-[#08090b] md:text-5xl">Tu vehículo, puesto en RD.</h1><p className="mt-4 max-w-lg text-lg text-[#676a70]">De la selección a la entrega. Conoce tu presupuesto antes de comprar.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/solicitar-vehiculo" className="home-orange-button inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-center font-semibold">Solicitar mi vehículo</Link><a href="#estimador" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8dbe0] px-5 text-center font-semibold text-[#08090b]">Calcular importación</a></div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f6f7]"><Image src={EDITORIAL.port.src} alt={EDITORIAL.port.alt} fill priority sizes="(min-width:1024px) 45vw, 92vw" quality={75} className="object-cover" /></div>
      </div>
    </PageContainer></section>
    <Section className="section-light bg-[#f5f6f7]" tight><PageContainer>
      <h2 className="text-3xl font-bold text-[#08090b]">Cuatro pasos. Un solo equipo.</h2>
      <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step,index) => <li key={step.title} className="overflow-hidden rounded-2xl border border-[#e4e6ea] bg-white"><div className="relative aspect-[4/3]"><Image src={step.image.src} alt={step.image.alt} fill sizes="(min-width:1024px) 23vw, (min-width:640px) 45vw, 92vw" quality={70} className="object-cover" /></div><div className="p-5"><span className="text-xs font-bold text-[#a54d1c]">0{index+1}</span><h3 className="mt-2 font-bold text-[#08090b]">{step.title}</h3><p className="mt-2 text-sm text-[#676a70]">{step.text}</p></div></li>)}</ol>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/subastas" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#08090b] px-5 font-semibold text-white">Ver oportunidades de subasta</Link><a href={whatsappHref("Hola Valcron, quiero importar un vehículo a RD.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8dbe0] bg-white px-5 font-semibold text-[#08090b]">Hablar por WhatsApp</a></div>
    </PageContainer></Section>
    <Section className="section-light scroll-mt-24 bg-white" id="estimador"><PageContainer><div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><div><h2 className="text-3xl font-bold text-[#08090b]">Calcula tu presupuesto</h2><p className="mt-3 text-sm text-[#676a70]">Resultado estimado. Confirmamos la cotización final según el lote.</p><Link href="/solicitar-vehiculo" className="mt-4 inline-flex min-h-12 items-center font-semibold text-[#a54d1c] underline underline-offset-4">Prefiero solicitar una cotización</Link></div><ImportCostCalculator /></div></PageContainer></Section>
  </main>;
}
