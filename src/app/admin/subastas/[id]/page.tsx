import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminAuctionForm } from "@/components/admin/AdminAuctionForm";
import { getAuctionOpportunity } from "@/app/actions/auctions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oportunidad de subasta",
};

export default async function AdminSubastaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { opportunity, linkedVehicle } = await getAuctionOpportunity(id);
  if (!opportunity) {
    notFound();
  }
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[var(--admin-text-muted)]">Cargando editor…</div>}>
      <AdminAuctionForm opportunity={opportunity} linkedVehicle={linkedVehicle} />
    </Suspense>
  );
}
