import { MensajeriaInbox } from "@/app/admin/mensajeria/inbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp",
};

export default async function WhatsAppInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  return <MensajeriaInbox canal="whatsapp" searchParams={searchParams} />;
}
