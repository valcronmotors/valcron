"use client";

import { useActionState } from "react";
import { saveIaConfig } from "@/app/actions/ia-config";
import {
  AdminCard,
  AdminError,
  AdminField,
  AdminInput,
  AdminPrimaryButton,
  AdminSuccess,
  AdminTextArea,
} from "@/components/admin/ui";
import type { IaConfigView } from "@/lib/messaging";

export function IaConfigForm({ config }: { config: IaConfigView }) {
  const [state, action, pending] = useActionState(saveIaConfig, { error: null });

  return (
    <form action={action} className="grid gap-6">
      <AdminError message={state.error} />
      <AdminSuccess show={Boolean(state.success)}>{state.success}</AdminSuccess>

      <AdminCard>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          WhatsApp Business / Meta Graph API
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold text-[#0B0C10]">
          Tokens de canal
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Los tokens se guardan en el servidor y solo se muestran enmascarados.
          Déjalos vacíos para conservar el valor actual.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <AdminField label="WhatsApp token">
            <AdminInput
              name="whatsapp_token"
              type="password"
              autoComplete="off"
              placeholder={config.whatsappMasked}
            />
          </AdminField>
          <AdminField label="Instagram token">
            <AdminInput
              name="instagram_token"
              type="password"
              autoComplete="off"
              placeholder={config.instagramMasked}
            />
          </AdminField>
          <AdminField label="Facebook token">
            <AdminInput
              name="facebook_token"
              type="password"
              autoComplete="off"
              placeholder={config.facebookMasked}
            />
          </AdminField>
          <AdminField label="Verify token del webhook">
            <AdminInput
              name="webhook_verify_token"
              type="password"
              autoComplete="off"
              placeholder={config.webhookMasked}
            />
          </AdminField>
          <AdminField label="Phone Number ID">
            <AdminInput
              name="phone_number_id"
              defaultValue={config.phoneNumberId}
              placeholder="ID del número WhatsApp Business"
            />
          </AdminField>
          <AdminField label="WABA ID">
            <AdminInput
              name="waba_id"
              defaultValue={config.wabaId}
              placeholder="WhatsApp Business Account ID"
            />
          </AdminField>
        </div>
        <p className="mt-4 break-all rounded-lg bg-[#F8F9FA] px-3 py-2 text-xs text-gray-500">
          Callback URL: {config.webhookUrl}
        </p>
      </AdminCard>

      <AdminCard>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          Asesor IA Valcron Motors
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold text-[#0B0C10]">
          Prompt base
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Instrucciones para consultar stock en Supabase, responder sobre
          subastas Copart / IAAI / Manheim e incentivos de la Ley 103-13.
        </p>
        <AdminField label="Prompt">
          <AdminTextArea
            name="prompt_base"
            defaultValue={config.promptBase}
            rows={16}
            className="min-h-64 font-mono text-[13px] leading-6"
          />
        </AdminField>
        <div className="mt-6">
          <AdminPrimaryButton type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar configuración"}
          </AdminPrimaryButton>
        </div>
      </AdminCard>
    </form>
  );
}
