import {
  AppShell,
  PrimaryButtonLink,
  SecondaryButtonLink,
} from "@/components/app-shell";
import { VehicleForm } from "@/components/vehicle-form";
import { COMPANY_NAMES } from "@/lib/companies";

export default async function NuevoVehiculoPage() {
  return (
    <AppShell
      title="Agregar vehículo"
      subtitle={`Alta de inventario para ${COMPANY_NAMES.valcron}. El costo total y el precio estimado se calculan automáticamente.`}
      actions={
        <>
          <SecondaryButtonLink href="/vehiculos">Volver al listado</SecondaryButtonLink>
          <PrimaryButtonLink href="/admin">Dashboard</PrimaryButtonLink>
        </>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <VehicleForm />
      </section>
    </AppShell>
  );
}
