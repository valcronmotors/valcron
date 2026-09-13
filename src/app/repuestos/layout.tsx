import { requireAdmin } from "@/lib/auth";

export default async function RepuestosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
