import { CuotaSimulator } from "@/components/admin/CuotaSimulator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulador de Cuotas",
};

export default function SimuladorPage() {
  return <CuotaSimulator />;
}
