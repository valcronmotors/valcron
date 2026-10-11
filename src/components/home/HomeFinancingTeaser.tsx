import Link from "next/link";
import { ArrowRight, Landmark, Ship, Search } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

const SERVICES = [
  { href: "/solicitar-vehiculo", icon: Search, title: "Búsqueda personalizada", copy: "Tu modelo, tu presupuesto. Revisamos opciones para ti.", cta: "Cuéntanos qué buscas" },
  { href: "/financiamiento", icon: Landmark, title: "Bancos locales", copy: "Te orientamos con las opciones. Cada banco evalúa y aprueba.", cta: "Conocer opciones" },
  { href: "/importacion", icon: Ship, title: "Compra e importación", copy: "Coordinación de compra, transporte y llegada a República Dominicana.", cta: "Ver el proceso" },
];

export function HomeFinancingTeaser() {
  return <Section className="section-light bg-[#f6f7f9]"><PageContainer wide>
    <div className="text-center"><p className="home-eyebrow">Acompañamiento Valcron</p><h2 className="home-section-title mt-3">Una opción para cada camino.</h2></div>
    <ul className="mt-9 grid gap-5 md:grid-cols-3">{SERVICES.map(s => { const Icon = s.icon; return <li key={s.href} className="rounded-2xl border border-[#e8eaef] bg-white p-7"><Icon className="h-8 w-8 text-[#a74718]" aria-hidden="true" /><h3 className="mt-6 font-display text-xl font-bold text-[#17191d]">{s.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#676b73]">{s.copy}</p><Link href={s.href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17191d]">{s.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></li>; })}</ul>
  </PageContainer></Section>;
}
