import { MensajeriaInbox } from "@/app/admin/mensajeria/inbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook",
};

export default async function FacebookInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  return <MensajeriaInbox canal="facebook" searchParams={searchParams} />;
}
