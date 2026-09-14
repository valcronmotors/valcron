import { IaConfigForm } from "@/components/admin/IaConfigForm";
import { getIaConfig } from "@/app/actions/ia-config";
import { AdminError } from "@/components/admin/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA & Webhooks Meta",
};

export default async function IaConfigPage() {
  const { config, error } = await getIaConfig();

  return (
    <div className="grid w-full gap-4">
      <p className="text-sm text-gray-500">
        Conecta WhatsApp Business, Instagram y Facebook Messenger. El Asesor IA
        usa este prompt para consultar inventario real y no inventar unidades.
      </p>
      <AdminError message={error} />
      <IaConfigForm config={config} />
    </div>
  );
}
