import {
  AppShell,
  PrimaryButtonLink,
  SecondaryButtonLink,
} from "@/components/app-shell";
import { PartForm } from "@/components/part-form";
import { COMPANY_NAMES } from "@/lib/companies";

export default async function NuevoRepuestoPage() {
  return (
    <AppShell
      title="Agregar repuesto"
      subtitle={`Alta de inventario para ${COMPANY_NAMES.partsDirect}.`}
      actions={
        <>
          <SecondaryButtonLink href="/repuestos">Volver al listado</SecondaryButtonLink>
          <PrimaryButtonLink href="/admin">Dashboard</PrimaryButtonLink>
        </>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <PartForm />
      </section>
    </AppShell>
  );
}
