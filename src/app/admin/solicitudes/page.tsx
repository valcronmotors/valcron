import { AdminInquiriesList } from "@/components/admin/AdminInquiriesList";
import { getAdminInquiries } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitudes",
};

export default async function AdminSolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const params = await searchParams;
  const { inquiries, error } = await getAdminInquiries();
  return <AdminInquiriesList inquiries={inquiries} error={error} initialStatus={params.estado} />;
}
