import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { ADMIN_MODULE_HREFS, findAdminNavItem } from "@/lib/admin-nav";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const href = `/admin/${slug.join("/")}`;
  const match = findAdminNavItem(href);
  return { title: match?.item.label ?? "Módulo" };
}

export default async function AdminModulePage({ params }: Props) {
  const { slug } = await params;
  const href = `/admin/${slug.join("/")}`;

  if (!ADMIN_MODULE_HREFS.has(href)) {
    notFound();
  }

  const match = findAdminNavItem(href);
  if (!match) {
    notFound();
  }

  return (
    <AdminPlaceholder
      title={match.item.label}
      description={match.item.description}
    />
  );
}
