import { AdminAuctionList } from "@/components/admin/AdminAuctionList";
import { listAuctionOpportunities } from "@/app/actions/auctions";
import { providerFilterFromParam } from "@/lib/auctions/opportunity-admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oportunidades de subasta",
};

export default async function AdminSubastasPage({
  searchParams,
}: {
  searchParams: Promise<{ proveedor?: string }>;
}) {
  const params = await searchParams;
  const { opportunities, error } = await listAuctionOpportunities();
  return (
    <AdminAuctionList
      opportunities={opportunities}
      error={error}
      provider={providerFilterFromParam(params.proveedor)}
    />
  );
}
