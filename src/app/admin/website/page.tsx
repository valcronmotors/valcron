import { AdminWebsiteView } from "@/components/admin/AdminWebsiteView";
import {
  getAdminInquiries,
  getValcronVehicles,
} from "@/lib/admin-data";
import { listAuctionOpportunities } from "@/app/actions/auctions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website",
};

export default async function AdminWebsitePage() {
  const [local, auctions, inquiries] = await Promise.all([
    getValcronVehicles(),
    listAuctionOpportunities(),
    getAdminInquiries(),
  ]);
  return (
    <AdminWebsiteView
      vehicles={local.vehicles}
      auctionOpportunities={auctions.opportunities}
      error={local.error ?? auctions.error ?? inquiries.error}
      inquiries={inquiries.inquiries}
    />
  );
}
