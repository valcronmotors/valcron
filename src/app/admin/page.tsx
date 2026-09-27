import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getAdminDashboardSnapshot } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminPage() {
  const snapshot = await getAdminDashboardSnapshot();

  return (
    <div className="flex h-full min-h-full w-full flex-col">
      <AdminDashboardView
        vehicles={snapshot.vehicles}
        inquiries={snapshot.inquiries}
        auctionCount={snapshot.auctionCount}
        error={snapshot.error}
      />
    </div>
  );
}
