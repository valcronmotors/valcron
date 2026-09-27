"use server";

import { revalidatePath } from "next/cache";
import { publicActionError } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/auth";
import { isInquiryStatus, type InquiryStatus } from "@/lib/website-schema";
import { createClient } from "@/utils/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function setInquiryStatus(inquiryId: string, status: InquiryStatus) {
  await requireAdmin();
  if (!UUID_RE.test(inquiryId) || !isInquiryStatus(status)) {
    return { error: "Solicitud inválida." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", inquiryId);
  if (error) {
    return { error: publicActionError(error, "No se pudo actualizar la solicitud.") };
  }

  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin");
  return { error: null };
}
