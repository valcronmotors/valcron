"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";
import { VehicleCard } from "@/components/public/VehicleCard";
import { VehicleCarousel } from "@/components/public/VehicleCarousel";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { filterAuctionCatalogVehicles, filterLocalStockVehicles } from "@/lib/catalogs";
import { SITE, whatsappHref } from "@/lib/site";
import type { PublicVehicle } from "@/types/vehicle";

export function HomeInventoryTabs({
  vehicles,
  auctions,
  inventoryError,
  auctionError,
}: {
  vehicles: PublicVehicle[];
  auctions: PublicVehicle[];
  inventoryError: string | null;
  auctionError: string | null;
}) {
  const [active, setActive] = useState<"available" | "auction">("available");
  const available = filterLocalStockVehicles(vehicles).slice(0, 3);
  const opportunities = filterAuctionCatalogVehicles(auctions).slice(0, 3);
  const items = active === "available" ? available : opportunities;
  const error = active === "available" ? inventoryError : auctionError;

  return (
    <>
      <Section className="section-light bg-[#f5f6f7] !py-7 md:!py-10" id="inventario-valcron">
        <PageContainer wide>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">Compra con información clara</p>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">Nuestros vehículos</h2>
              <p className="mt-1 text-sm text-[#676a70]">Unidades disponibles y oportunidades de subasta en un mismo lugar.</p>
            </div>
            <Link href={active === "available" ? "/inventario" : "/subastas"} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#111111] underline-offset-4 hover:underline">
              {active === "available" ? "Ver todo el inventario" : "Ver todas las subastas"} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mb-5 inline-flex w-full rounded-xl border border-[#e0e2e6] bg-white p-1 sm:w-auto" role="tablist" aria-label="Catálogo de vehículos">
            <button type="button" role="tab" aria-selected={active === "available"} onClick={() => setActive("available")} className={`min-h-11 flex-1 rounded-lg px-4 text-sm font-semibold transition sm:flex-none ${active === "available" ? "bg-[#08090b] text-white shadow-sm" : "text-[#454951] hover:bg-[#f3f4f6]"}`}>
              Disponibles ({available.length})
            </button>
            <button type="button" role="tab" aria-selected={active === "auction"} onClick={() => setActive("auction")} className={`min-h-11 flex-1 rounded-lg px-4 text-sm font-semibold transition sm:flex-none ${active === "auction" ? "bg-[#08090b] text-white shadow-sm" : "text-[#454951] hover:bg-[#f3f4f6]"}`}>
              Subastas ({opportunities.length})
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-7 text-sm text-[#676a70]">No pudimos cargar este catálogo en este momento. Intenta de nuevo en unos minutos.</div>
          ) : items.length ? (
            <div role="tabpanel">
              <div className="-mx-[var(--page-gutter)] px-[var(--page-gutter)] xl:mx-0 xl:px-0">
                <VehicleCarousel speedSeconds={64}>
                  {items.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} tone="light" compact actionLabel={active === "available" ? "Ver detalles" : "Ver oportunidad"} />
                  ))}
                </VehicleCarousel>
              </div>
              {active === "auction" ? <p className="mt-4 text-xs text-[#676a70]">En subastas, el precio se consulta por WhatsApp. Lote y daño son datos informativos; confirma los detalles antes de ofertar.</p> : null}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-7 text-sm text-[#676a70]">No hay publicaciones disponibles en esta categoría por el momento.</div>
          )}
        </PageContainer>
      </Section>

      <section className="border-y border-[#e8eaed] bg-white px-[var(--page-gutter)] py-5" aria-label="Redes sociales Valcron Motors">
        <div className="mx-auto flex max-w-[var(--content-wide)] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold text-[#17191d]">Síguenos en Instagram y Facebook para nuevas llegadas</p>
          <div className="flex items-center gap-3">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e1e3e8] px-4 text-sm font-semibold text-[#17191d] hover:bg-[#f5f6f7]" aria-label="Seguir a Valcron Motors en Instagram"><Instagram className="h-4 w-4" aria-hidden="true" /> Instagram</a>
            <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e1e3e8] px-4 text-sm font-semibold text-[#17191d] hover:bg-[#f5f6f7]" aria-label="Seguir a Valcron Motors en Facebook"><span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1877f2] text-[11px] font-bold text-white">f</span> Facebook</a>
          </div>
        </div>
      </section>
    </>
  );
}

export function HomeMobileActionBar() {
  return (
    <nav aria-label="Acciones rápidas" className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-2 border-t border-[#e5e7eb] bg-white/95 px-3 pt-2 backdrop-blur-md lg:hidden" style={{ paddingBottom: "max(0.55rem, env(safe-area-inset-bottom))" }}>
      <Link href="/inventario" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#08090b] px-3 text-sm font-semibold text-white"><ArrowRight className="h-4 w-4" aria-hidden="true" /> Ver vehículos</Link>
      <a href={whatsappHref("Hola, quiero información sobre los vehículos disponibles en Valcron Motors.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#128c4b] px-3 text-sm font-semibold text-white"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
    </nav>
  );
}
