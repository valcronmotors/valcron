import type { Metadata } from "next";
import type { PublicVehicle } from "@/types/vehicle";
import { createAdminClient, isServiceRoleConfigured } from "@/utils/supabase/admin";
import { confirmedAuctionRunAndDrive } from "@/lib/auction-detail-facts";
import { notFound, permanentRedirect } from "next/navigation";
import { PublicVehicleDetail } from "@/components/public/PublicVehicleDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadPublicVehicleById } from "@/lib/public-inventory";
import { SITE } from "@/lib/site";
import { absoluteUrl, breadcrumbJsonLd, publicPageMetadata, vehicleJsonLd } from "@/lib/seo";
import { getSimilarVehicles } from "@/lib/vehicles/adapter";
import { vehicleDisplayTitle, vehicleSeoDescription } from "@/lib/vehicles/vehicle-formatters";
import { isVehicleUuid, vehiclePath } from "@/lib/vehicles/vehicle-slugs";


// This server-only projection releases one approved lot fact, never the private metadata.
async function loadAuctionRunAndDrive(vehicle: PublicVehicle) {
  if (!vehicle.published || vehicle.listingKind !== "auction" || !isServiceRoleConfigured()) return false;
  const { data, error } = await createAdminClient()
    .from("auction_opportunities")
    .select("auction_metadata")
    .eq("linked_vehicle_id", vehicle.id)
    .eq("status", "published")
    .limit(1)
    .abortSignal(AbortSignal.timeout(5000))
    .maybeSingle();
  if (error) {
    console.error("auction public run-and-drive lookup failed", error.code);
    return false;
  }
  return confirmedAuctionRunAndDrive(data?.auction_metadata?.run_and_drive);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await loadPublicVehicleById(id);
  if (!result.data) {
    return { title: "Vehículo" };
  }
  const title = vehicleDisplayTitle(result.data);
  const image = result.data.images[0]?.url ?? result.data.fotosUrls[0];
  const imageUrl = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : undefined;
  return {
    ...publicPageMetadata({
      title,
      description: vehicleSeoDescription(result.data),
      path: vehiclePath(result.data.slug),
    }),
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${SITE.shortName}`,
      description: vehicleSeoDescription(result.data),
      url: absoluteUrl(vehiclePath(result.data.slug)),
      locale: "es_DO",
      siteName: SITE.shortName,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: vehicleSeoDescription(result.data),
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function InventarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadPublicVehicleById(id);
  if (!result.data) {
    notFound();
  }

  if (isVehicleUuid(id) && result.data.slug !== id) {
    permanentRedirect(vehiclePath(result.data.slug));
  }

  const [similar, runAndDrive] = await Promise.all([getSimilarVehicles(result.data, 4), loadAuctionRunAndDrive(result.data)]);
  const title = vehicleDisplayTitle(result.data);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Inventario", path: "/inventario" },
          { name: title, path: vehiclePath(result.data.slug) },
        ])}
      />
      <JsonLd data={vehicleJsonLd(result.data)} />
      <PublicVehicleDetail vehicle={result.data} similar={similar.data} auctionRunAndDrive={runAndDrive} />
    </main>
  );
}
