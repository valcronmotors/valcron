import {
  AppShell,
  PrimaryButtonLink,
  SecondaryButtonLink,
} from "@/components/app-shell";
import { VehicleForm } from "@/components/vehicle-form";
import { COMPANY_NAMES } from "@/lib/companies";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function EditarVehiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select(
      "id, vin, marca, modelo, trim, ano, estado, costo_subasta_usd, gastos_taller_usa_usd, gastos_grua_usd, gastos_titulacion_usd, fees_adicionales_usd, flete_usd, tasa_usd_dop, costo_taller_dop, impuestos_dga_dop, precio_venta_dop, fotos_urls, ubicacion_lote, lote_numero, fuente_subasta",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <AppShell
      title="Editar vehículo"
      subtitle={`Actualiza el inventario de ${COMPANY_NAMES.valcron}.`}
      actions={
        <>
          <SecondaryButtonLink href={`/vehiculos/${id}`}>Ver ficha</SecondaryButtonLink>
          <SecondaryButtonLink href="/vehiculos">Volver al listado</SecondaryButtonLink>
          <PrimaryButtonLink href="/admin">Dashboard</PrimaryButtonLink>
        </>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <VehicleForm vehicle={data} />
      </section>
    </AppShell>
  );
}
