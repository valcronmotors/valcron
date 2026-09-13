import {
  AppShell,
  PrimaryButtonLink,
  SecondaryButtonLink,
} from "@/components/app-shell";
import { PartForm } from "@/components/part-form";
import { COMPANY_NAMES } from "@/lib/companies";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function EditarRepuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repuestos")
    .select(
      "id, codigo_pieza, nombre, cantidad, precio_costo, envio_usd, comisiones_usd, precio_venta, canales_venta",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <AppShell
      title="Editar repuesto"
      subtitle={`Actualiza el inventario de ${COMPANY_NAMES.partsDirect}.`}
      actions={
        <>
          <SecondaryButtonLink href="/repuestos">Volver al listado</SecondaryButtonLink>
          <PrimaryButtonLink href="/admin">Dashboard</PrimaryButtonLink>
        </>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <PartForm part={data} />
      </section>
    </AppShell>
  );
}
