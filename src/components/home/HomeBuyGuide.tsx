import { Search, ClipboardCheck, CarFront } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const STEPS = [
  { icon: Search, title: "Encuentra tu opción", copy: "Elige una unidad del inventario o solicita el modelo que tienes en mente." },
  { icon: ClipboardCheck, title: "Revisa los detalles", copy: "Conoce fotos, condición y presupuesto antes de decidir." },
  { icon: CarFront, title: "Da el siguiente paso", copy: "Coordinamos contigo la compra y los servicios que necesites." },
];

export function HomeBuyGuide() {
  return <Section className="section-light bg-white" tight><PageContainer wide>
    <div className="text-center"><p className="home-eyebrow">Así funciona</p><h2 className="home-section-title mt-3">Más sencillo, desde el primer paso.</h2></div>
    <ol className="home-steps mx-auto mt-10 grid max-w-5xl gap-9 md:grid-cols-3 md:gap-12">{STEPS.map((step, i) => { const Icon = step.icon; return <li key={step.title} className="relative text-center">
      <span className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_8px_24px_rgba(25,27,35,0.08)] ${i === 1 ? "bg-[#f47735] text-[#23150e]" : "bg-[#f5f6f8] text-[#a74718]"}`}><Icon className="h-7 w-7" aria-hidden="true" /></span>
      <p className="mt-6 text-xs font-semibold text-[#a74718]">0{i + 1}</p><h3 className="mt-2 font-display text-lg font-bold text-[#17191d]">{step.title}</h3><p className="mx-auto mt-3 max-w-[17rem] text-sm leading-relaxed text-[#676b73]">{step.copy}</p>
    </li>; })}</ol>
  </PageContainer></Section>;
}
