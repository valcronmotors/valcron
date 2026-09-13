import { requireAdmin } from "@/lib/auth";

export default async function VehiculosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
