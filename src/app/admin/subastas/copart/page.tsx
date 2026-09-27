import { AdminAuctionTabs } from "@/components/admin/AdminAuctionTabs";
import { AdminCopartSearch } from "@/components/admin/AdminCopartSearch";
import { AdminPageHeader, AdminPrimaryButton } from "@/components/admin/ui";
import { searchCopartInventory } from "@/app/actions/copart";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario Copart",
};

export default async function AdminCopartSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const bin = read("bin");
  const result = await searchCopartInventory({
    query: read("q"),
    make: read("make"),
    model: read("model"),
    yearMin: read("yearMin") ? Number(read("yearMin")) : undefined,
    yearMax: read("yearMax") ? Number(read("yearMax")) : undefined,
    locationState: read("state"),
    titleType: read("title"),
    primaryDamage: read("damage"),
    runCondition: read("run"),
    buyItNow: bin === "si" ? true : bin === "no" ? false : undefined,
    mileageMin: read("mileageMin") ? Number(read("mileageMin")) : undefined,
    mileageMax: read("mileageMax") ? Number(read("mileageMax")) : undefined,
    page: read("page") ? Number(read("page")) : 1,
  });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Inventario Copart"
        subtitle="Feed oficial de Sales Data. Busca, revisa y agrega lotes a oportunidades. No se publica al website desde aquí."
        actions={
          <Link href="/admin/subastas/nuevo">
            <AdminPrimaryButton>Agregar manualmente</AdminPrimaryButton>
          </Link>
        }
      />
      <AdminAuctionTabs active="copart" />
      <AdminCopartSearch
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        facets={result.facets}
        freshness={result.freshness}
        error={result.error}
        filters={{
          q: read("q"),
          make: read("make"),
          model: read("model"),
          yearMin: read("yearMin"),
          yearMax: read("yearMax"),
          state: read("state"),
          title: read("title"),
          damage: read("damage"),
          run: read("run"),
          bin,
          mileageMin: read("mileageMin"),
          mileageMax: read("mileageMax"),
        }}
      />
    </div>
  );
}
