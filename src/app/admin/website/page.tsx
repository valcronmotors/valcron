import { AdminWebsiteView } from "@/components/admin/AdminWebsiteView";
import {
  getAdminInquiries,
  getAuctionCatalogVehiclesAdmin,
  getValcronVehicles,
} from "@/lib/admin-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website",
};

export default async function AdminWebsitePage() {
  const [local, auctions, inquiries] = await Promise.all([
    getValcronVehicles(),
    getAuctionCatalogVehiclesAdmin(),
    getAdminInquiries(),
  ]);
  return (
    <AdminWebsiteView
      vehicles={local.vehicles}
      auctionVehicles={auctions.vehicles}
      inquiries={inquiries.inquiries}
    />
  );
}
