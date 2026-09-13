import { AdminVehicleForm } from "@/components/admin/AdminVehicleForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agregar Vehículo",
};

export default function AdminNuevoVehiculoPage() {
  return <AdminVehicleForm />;
}
