import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Valcron Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminProfile();

  return (
    <div className="admin-console h-dvh w-full min-h-dvh overflow-hidden">
      <AdminShell user={user}>{children}</AdminShell>
    </div>
  );
}
