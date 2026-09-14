import { MessagingWorkspace } from "@/components/admin/messaging/MessagingWorkspace";
import { getValcronVehicles } from "@/lib/admin-data";
import { listInbox, listInboxMessages } from "@/app/actions/messaging";
import { listStaffUsers } from "@/app/actions/users";
import { getAdminProfile } from "@/lib/auth";
import type { MessageChannel } from "@/lib/messaging";
import type { StaffUser } from "@/lib/staff";

export async function MensajeriaInbox({
  canal,
  searchParams,
}: {
  canal?: MessageChannel;
  searchParams: Promise<{ c?: string }>;
}) {
  const params = await searchParams;
  const [{ conversations, error }, { vehicles }, staff, profile] =
    await Promise.all([
      listInbox(),
      getValcronVehicles(),
      listStaffUsers(),
      getAdminProfile(),
    ]);

  const scoped = canal
    ? conversations.filter((row) => row.canal === canal)
    : conversations;

  const selectedId =
    params.c && scoped.some((row) => row.id === params.c) ? params.c : null;

  const { messages, error: messagesError } = selectedId
    ? await listInboxMessages(selectedId)
    : { messages: [], error: null };

  const agents: StaffUser[] = staff.users.filter((user) => !user.banned);
  if (profile.id && !agents.some((agent) => agent.id === profile.id)) {
    agents.unshift({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: "administrador",
      banned: false,
      createdAt: null,
    });
  }

  return (
    <MessagingWorkspace
      conversations={conversations}
      messages={messages}
      selectedId={selectedId}
      vehicles={vehicles}
      agents={agents}
      error={error ?? messagesError}
      canalFilter={canal ?? null}
      basePath={canal ? `/admin/mensajeria/${canal}` : "/admin/mensajeria"}
    />
  );
}
