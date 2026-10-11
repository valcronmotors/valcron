import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";

export function HomeHero() {
  return <section className="section-light home-showcase bg-[#f3f4f6]" aria-label="Portada"><PageContainer wide className="relative pb-10 pt-8 md:pb-14 md:pt-12">
    <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
      <div className="relative z-10 max-w-xl py-3 lg:py-12">
        <p className="home-eyebrow">Valcron Motors · Santo Domingo Este</p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.7rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#17191d]">Tu próximo vehículo.<br /><span className="text-[#a74718]">A tu manera.</span></h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#575b63] sm:text-lg">Explora nuestro inventario o dinos qué buscas. Nosotros te ayudamos a encontrarlo.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/inventario" className="home-orange-button">Ver vehículos <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/solicitar-vehiculo" className="home-outline-button">Solicitar una búsqueda</Link></div>
      </div>
      <div className="relative flex min-h-[19rem] flex-col justify-between rounded-[2rem] bg-[#f47735] px-6 py-7 sm:min-h-[23rem] sm:px-9 lg:min-h-[29rem]">
        <div className="relative z-10 flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#482008]">Explora el modelo</p><p className="mt-2 font-display text-2xl font-bold text-[#23150e] sm:text-3xl">Honda CR-V Hybrid</p></div><span className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#23150e]">2025</span></div>
        <span className="pointer-events-none absolute inset-x-6 top-20 text-center font-display text-[clamp(5rem,12vw,10rem)] font-bold tracking-tighter text-white/20" aria-hidden="true">HYBRID</span>
        <Image src="/marketing/honda-crv-hybrid-2025-cutout.png" alt="Honda CR-V Sport Touring Hybrid 2025 gris, imagen oficial de referencia del modelo" width={640} height={232} sizes="(max-width: 1024px) 90vw, 52vw" preload className="relative z-10 my-7 h-auto w-full drop-shadow-[0_20px_16px_rgba(62,28,11,0.2)] lg:-ml-16 lg:w-[calc(100%+5rem)] lg:max-w-none" />
        <p className="relative z-10 text-xs leading-relaxed text-[#482008]">Imagen de referencia. Modelo para búsqueda bajo solicitud.</p>
      </div>
    </div>
    <form action="/inventario" method="get" className="relative z-20 mt-7 grid gap-4 rounded-2xl border border-[#e7e8eb] bg-white p-5 shadow-[0_14px_45px_rgba(26,28,34,0.08)] sm:grid-cols-[1fr_1fr_auto] lg:-mt-2 lg:max-w-[52rem]">
      <label className="grid gap-2 text-xs font-semibold text-[#70747c]">Marca<select name="marca" defaultValue="" className="min-h-11 w-full rounded-lg bg-[#f6f7f9] px-3 text-sm text-[#17191d]"><option value="">Todas las marcas</option>{VEHICLE_BRANDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</select></label>
      <label className="grid gap-2 text-xs font-semibold text-[#70747c]">Modelo o palabra clave<input name="q" placeholder="Ej. Sportage, CR-V…" className="min-h-11 w-full rounded-lg bg-[#f6f7f9] px-3 text-sm text-[#17191d]" /></label>
      <button type="submit" className="home-orange-button self-end"><Search className="h-4 w-4" aria-hidden="true" />Buscar vehículos</button>
    </form>
  </PageContainer></section>;
}
