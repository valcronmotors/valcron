import { AdminAuctionForm } from "@/components/admin/AdminAuctionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar oportunidad",
};

export default function AdminNuevaSubastaPage() {
  return <AdminAuctionForm />;
}
