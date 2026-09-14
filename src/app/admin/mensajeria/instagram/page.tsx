import { MensajeriaInbox } from "@/app/admin/mensajeria/inbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram",
};

export default async function InstagramInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  return <MensajeriaInbox canal="instagram" searchParams={searchParams} />;
}
