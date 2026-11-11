import Link from "next/link";
import { PageContainer, Section } from "@/components/public/layout";

const steps = [
  ["Búsqueda y evaluación", "Modelo, lote y presupuesto."],
  ["Compra en Copart o IAAI", "Compramos la opción que apruebes."],
  ["Transporte y flete", "Traslado en EE. UU. y embarque a RD."],
  ["Llegada y entrega en RD", "Aduana, primera placa y entrega."],
];

export function HomeImport() {
  return <Section className="section-light bg-[#f5f6f7]" id="importacion-por-encargo"><PageContainer>
    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a54d1c]">De la búsqueda a tu entrega</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#08090b]">Importación por encargo</h2>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#676a70]">Elige tu vehículo. Coordinamos el proceso hasta RD.</p>
    <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([title, text], i) => <li key={title} className="rounded-2xl border border-[#e4e6ea] bg-white p-5"><span className="text-sm font-bold text-[#ec752f]">0{i + 1}</span><h3 className="mt-3 font-semibold text-[#08090b]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#676a70]">{text}</p></li>)}</ol>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/solicitar-vehiculo" className="home-orange-button inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold">Solicitar mi vehículo</Link><Link href="/calculadoras/importacion" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8dbe0] bg-white px-5 font-semibold text-[#08090b]">¿Cuánto me sale puesto en RD?</Link></div>
    <p className="mt-3 text-xs text-[#676a70]">Alcance, disponibilidad y costos sujetos a cotización final.</p>
  </PageContainer></Section>;
}
