import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getValcronVehicles } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminPage() {
  const { vehicles, error } = await getValcronVehicles();

  return (
    <div className="flex h-full min-h-full w-full flex-col">
      <AdminDashboardView vehicles={vehicles} error={error} />
    </div>
  );
}
