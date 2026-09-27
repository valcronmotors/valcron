import { AdminWebsiteView } from "@/components/admin/AdminWebsiteView";
import { getAdminInquiries, getValcronVehicles } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website",
};

export default async function AdminWebsitePage() {
  const [{ vehicles }, inquiries] = await Promise.all([getValcronVehicles(), getAdminInquiries()]);
  return <AdminWebsiteView vehicles={vehicles} inquiries={inquiries.inquiries} />;
}
