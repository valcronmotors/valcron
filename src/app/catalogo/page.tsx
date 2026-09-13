import { AppShell } from "@/components/app-shell";
import { VehicleCatalog } from "@/components/public/VehicleCatalog";
import { COMPANY_NAMES } from "@/lib/companies";

export default function CatalogoPage() {
  return (
    <AppShell
      wide
      title="Catálogo público"
      subtitle={`Inventario Disponible de ${COMPANY_NAMES.valcron} sincronizado con valcronmotors.com.`}
    >
      <VehicleCatalog />
    </AppShell>
  );
}
