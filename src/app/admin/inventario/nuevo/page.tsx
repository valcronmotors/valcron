import { AdminVehicleEditor } from "@/components/admin/AdminVehicleEditor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar vehículo",
};

export default function AdminNuevoVehiculoPage() {
  return <AdminVehicleEditor />;
}
