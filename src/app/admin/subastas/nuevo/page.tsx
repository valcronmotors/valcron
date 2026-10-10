import { Suspense } from "react";
import { AdminAuctionForm } from "@/components/admin/AdminAuctionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar vehículo de subasta",
};

export default function AdminNuevaSubastaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[var(--admin-text-muted)]">Cargando editor…</div>}>
      <AdminAuctionForm />
    </Suspense>
  );
}
