import { NextResponse } from "next/server";
import { createAdminClient, getServiceRoleKey } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode !== "subscribe" || !token || !challenge) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let expected = process.env.META_WEBHOOK_VERIFY_TOKEN ?? "";
  if (!expected && getServiceRoleKey()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("ia_config")
      .select("webhook_verify_token")
      .eq("id", "valcron")
      .maybeSingle();
    expected = data?.webhook_verify_token ?? "";
  }

  if (!expected || token !== expected) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ received: true });
}
