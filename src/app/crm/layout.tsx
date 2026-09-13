import { requireAdmin } from "@/lib/auth";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
