import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getOpenQuotesUsd, getValcronVehicles } from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Principal",
};

export default async function AdminPage() {
  const [{ vehicles, error }, quotes] = await Promise.all([
    getValcronVehicles(),
    getOpenQuotesUsd(),
  ]);

  return (
    <AdminDashboardView
      vehicles={vehicles}
      error={error ?? quotes.error}
      receivableUsd={quotes.totalUsd}
      receivableCount={quotes.count}
    />
  );
}
