import Image from "next/image";
import { ArrowRight, BatteryCharging, Gauge, Mountain, ShieldCheck } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { whatsappHref } from "@/lib/site";

// Manufacturer references and image origins: docs/home-redesign-assets.md.
const FEATURES = [
  { icon: BatteryCharging, title: "Sistema híbrido", copy: "Motor 2.0 L y dos motores eléctricos." },
  { icon: Gauge, title: "204 hp combinados", copy: "Potencia total del sistema híbrido." },
  { icon: Mountain, title: "Tracción AWD", copy: "De serie en Sport Touring Hybrid." },
  { icon: ShieldCheck, title: "Honda Sensing", copy: "Tecnologías de asistencia al conductor." },
];

export function HomeModelSpotlight() {
  return <Section className="section-light bg-white" id="modelo-destacado"><PageContainer wide>
    <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
      <div className="relative rounded-[2rem] border border-[#e9ebef] bg-[#f6f7f9] p-5 sm:p-8">
        <span className="inline-flex rounded-full bg-[#ffeadc] px-4 py-2 text-xs font-semibold text-[#8c4017]">Conoce el modelo · 2025</span>
        <Image src="/marketing/honda-crv-hybrid-2025.jpg" alt="Honda CR-V Sport Touring Hybrid 2025 azul, vista frontal de referencia del fabricante" width={735} height={368} sizes="(max-width: 1024px) 90vw, 45vw" className="my-8 h-auto w-full rounded-2xl" />
        <div className="grid grid-cols-3 divide-x divide-[#e1e3e8] text-center"><div><p className="font-display text-xl font-bold text-[#17191d]">2.0 L</p><p className="mt-1 text-xs text-[#676b73]">Motor gasolina</p></div><div><p className="font-display text-xl font-bold text-[#17191d]">204 hp</p><p className="mt-1 text-xs text-[#676b73]">Sistema combinado</p></div><div><p className="font-display text-xl font-bold text-[#17191d]">AWD</p><p className="mt-1 text-xs text-[#676b73]">Sport Touring</p></div></div>
      </div>
      <div><p className="home-eyebrow">Ideas para tu próxima búsqueda</p><h2 className="home-section-title mt-3">Honda CR-V<br /><span className="text-[#a74718]">Hybrid 2025.</span></h2><p className="mt-4 text-base leading-relaxed text-[#676b73]">Un SUV que combina espacio, tecnología y un sistema híbrido para tus recorridos de cada día.</p>
        <ul className="mt-7 grid gap-5 sm:grid-cols-2">{FEATURES.map(f => { const Icon = f.icon; return <li key={f.title} className="flex gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[#a74718]"><Icon className="h-5 w-5" aria-hidden="true" /></span><div><h3 className="text-sm font-bold text-[#17191d]">{f.title}</h3><p className="mt-1 text-xs leading-relaxed text-[#676b73]">{f.copy}</p></div></li>; })}</ul>
        <a href={whatsappHref("Hola, me interesa solicitar una búsqueda de Honda CR-V Hybrid 2025. Quiero conocer opciones y presupuesto.")} target="_blank" rel="noopener noreferrer" className="home-orange-button mt-8">Buscar este modelo <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        <p className="mt-4 text-xs leading-relaxed text-[#676b73]">Referencia de versión estadounidense Sport Touring Hybrid. Equipamiento según versión; disponibilidad y precio se confirman al cotizar. <a href="https://hondanews.com/en-US/honda-automobiles/releases/release-f43bcac5ded8efe77b071fcb0c097416-2025-honda-cr-v-specifications-and-features" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Especificaciones de Honda</a>.</p>
      </div>
    </div>
  </PageContainer></Section>;
}
