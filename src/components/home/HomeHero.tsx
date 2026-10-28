"use client";

import Form from "next/form";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Camera } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { VEHICLE_BRANDS } from "@/lib/vehicle-brands";
import { SITE, whatsappHref } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="section-light bg-[#f3f4f6]" aria-label="Portada">
      <PageContainer wide className="pb-5 pt-5 md:pb-7 md:pt-7">
        <div className="mx-auto max-w-5xl text-center">
          <p className="home-eyebrow">Valcron Motors · Santo Domingo Este</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4.2vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#17191d]">
            Tu próximo vehículo. <span className="text-[#a74718]">A tu manera.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#575b63] sm:text-base">
            Vehículos disponibles, subastas y búsqueda personalizada. Encuentra tu próxima opción con Valcron.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Link href="/inventario" className="home-orange-button min-h-11">Ver todo el inventario <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <a href={whatsappHref("Hola, quiero conocer los vehículos disponibles en Valcron Motors.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d8dbe0] bg-white px-5 text-sm font-semibold text-[#17191d] hover:bg-[#f9fafb]"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>

        <Form action="/inventario" className="mx-auto mt-5 grid max-w-5xl gap-3 rounded-2xl border border-[#e7e8eb] bg-white p-3.5 shadow-[0_8px_28px_rgba(26,28,34,0.06)] sm:grid-cols-[0.8fr_1.2fr_auto] sm:items-end">
          <label className="grid gap-1 text-xs font-semibold text-[#70747c]">Marca
            <select name="marca" defaultValue="" className="min-h-10 w-full rounded-lg bg-[#f6f7f9] px-3 text-sm text-[#17191d]">
              <option value="">Todas las marcas</option>
              {VEHICLE_BRANDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#70747c]">Modelo o palabra clave
            <input name="q" placeholder="Ej. Sportage, CR-V…" className="min-h-10 w-full rounded-lg bg-[#f6f7f9] px-3 text-sm text-[#17191d]" />
          </label>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button type="submit" className="home-orange-button min-h-10 flex-1 sm:flex-none"><Search className="h-4 w-4" aria-hidden="true" />Buscar vehículos</button>
            <Link href="/inventario" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#d8dbe0] px-4 text-sm font-semibold text-[#17191d] hover:bg-[#f6f7f9] sm:flex-none">Ver todo el inventario</Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#eef0f2] pt-2 sm:col-span-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a8d91]">Marcas</span>
            {VEHICLE_BRANDS.slice(0, 8).map(brand => <Link key={brand.slug} href={`/inventario?marca=${encodeURIComponent(brand.name)}`} className="text-xs font-medium text-[#52565d] underline-offset-2 hover:text-[#a74718] hover:underline">{brand.name}</Link>)}
          </div>
        </Form>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#676a70]">
          <span className="font-medium text-[#17191d]">Síguenos para nuevas llegadas:</span>
          <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#a74718]"><Camera className="h-3.5 w-3.5" aria-hidden="true" /> Instagram</a>
          <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#a74718]"><span aria-hidden="true" className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1877f2] text-[10px] font-bold text-white">f</span> Facebook</a>
        </div>
      </PageContainer>
    </section>
  );
}
