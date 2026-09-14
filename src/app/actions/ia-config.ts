"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  DEFAULT_IA_PROMPT,
  maskSecret,
  type IaConfigView,
} from "@/lib/messaging";
import { SITE } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

export type IaConfigActionState = {
  error: string | null;
  success?: string | null;
};

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function webhookUrl() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || SITE.url;
  return `${origin}/api/webhooks/meta`;
}

type IaConfigRow = {
  id: string;
  whatsapp_token: string | null;
  instagram_token: string | null;
  facebook_token: string | null;
  phone_number_id: string | null;
  waba_id: string | null;
  webhook_verify_token: string | null;
  prompt_base: string;
};

function toView(row: IaConfigRow | null): IaConfigView {
  const whatsapp = maskSecret(row?.whatsapp_token);
  const instagram = maskSecret(row?.instagram_token);
  const facebook = maskSecret(row?.facebook_token);
  const webhook = maskSecret(row?.webhook_verify_token);
  return {
    whatsappConfigured: whatsapp.configured,
    instagramConfigured: instagram.configured,
    facebookConfigured: facebook.configured,
    whatsappMasked: whatsapp.masked,
    instagramMasked: instagram.masked,
    facebookMasked: facebook.masked,
    webhookMasked: webhook.masked,
    phoneNumberId: row?.phone_number_id ?? "",
    wabaId: row?.waba_id ?? "",
    promptBase: row?.prompt_base || DEFAULT_IA_PROMPT,
    webhookUrl: webhookUrl(),
  };
}

async function ensureConfig() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ia_config")
    .select(
      "id, whatsapp_token, instagram_token, facebook_token, phone_number_id, waba_id, webhook_verify_token, prompt_base",
    )
    .eq("id", "valcron")
    .maybeSingle();

  if (data) {
    return data as IaConfigRow;
  }

  const { data: created, error } = await supabase
    .from("ia_config")
    .insert({ id: "valcron", prompt_base: DEFAULT_IA_PROMPT })
    .select(
      "id, whatsapp_token, instagram_token, facebook_token, phone_number_id, waba_id, webhook_verify_token, prompt_base",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created as IaConfigRow;
}

export async function getIaConfig(): Promise<{
  config: IaConfigView;
  error: string | null;
}> {
  await requireAdmin();
  try {
    const row = await ensureConfig();
    return { config: toView(row), error: null };
  } catch (error) {
    return {
      config: toView(null),
      error: error instanceof Error ? error.message : "No se pudo cargar la configuración de IA.",
    };
  }
}

export async function saveIaConfig(
  _prev: IaConfigActionState | null,
  formData: FormData,
): Promise<IaConfigActionState> {
  await requireAdmin();
  const promptBase = requiredText(formData, "prompt_base") || DEFAULT_IA_PROMPT;
  const phoneNumberId = requiredText(formData, "phone_number_id");
  const wabaId = requiredText(formData, "waba_id");
  const whatsappToken = requiredText(formData, "whatsapp_token");
  const instagramToken = requiredText(formData, "instagram_token");
  const facebookToken = requiredText(formData, "facebook_token");
  const webhookToken = requiredText(formData, "webhook_verify_token");

  try {
    const current = await ensureConfig();
    const supabase = await createClient();
    const { error } = await supabase
      .from("ia_config")
      .update({
        prompt_base: promptBase,
        phone_number_id: phoneNumberId || null,
        waba_id: wabaId || null,
        whatsapp_token: whatsappToken || current.whatsapp_token,
        instagram_token: instagramToken || current.instagram_token,
        facebook_token: facebookToken || current.facebook_token,
        webhook_verify_token: webhookToken || current.webhook_verify_token,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "valcron");

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/configuracion/ia");
    return {
      error: null,
      success: "Configuración de IA y canales Meta guardada. Los tokens no se vuelven a mostrar completos.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo guardar la configuración.",
    };
  }
}
