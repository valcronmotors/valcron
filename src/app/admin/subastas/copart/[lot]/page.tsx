import Link from "next/link";
import { notFound } from "next/navigation";
import { getCopartLot } from "@/app/actions/copart";
import { AdminCopartDetail } from "@/components/admin/AdminCopartDetail";
import { AdminAuctionTabs } from "@/components/admin/AdminAuctionTabs";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lote Copart",
};

export default async function AdminCopartLotPage({
  params,
}: {
  params: Promise<{ lot: string }>;
}) {
  const { lot } = await params;
  const result = await getCopartLot(lot);
  if (!result.vehicle) {
    if (result.error) {
      return (
        <div className="grid gap-6">
          <AdminPageHeader title="Detalle Copart" subtitle="No se pudo cargar este lote." />
          <AdminAuctionTabs active="copart" />
          <p className="rounded-xl border border-[var(--admin-warning)]/20 bg-[var(--admin-warning-bg)] px-4 py-3 text-sm text-[var(--admin-warning)]">
            {result.error}
          </p>
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Detalle Copart"
        subtitle="Revisión interna del lote oficial. Para publicarlo, agrégalo a oportunidades y prepáralo para el website."
        actions={
          <Link href="/admin/subastas/copart">
            <AdminSecondaryButton>Volver al inventario Copart</AdminSecondaryButton>
          </Link>
        }
      />
      <AdminAuctionTabs active="copart" />
      <AdminCopartDetail
        vehicle={result.vehicle}
        gallery={result.gallery}
        freshness={result.freshness}
        error={result.error}
      />
    </div>
  );
}
