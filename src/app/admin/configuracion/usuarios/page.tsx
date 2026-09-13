import { StaffUsersWorkspace } from "@/components/admin/StaffUsersWorkspace";
import { listStaffUsers } from "@/app/actions/users";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios y Permisos",
};

export default async function AdminUsuariosPage() {
  const { users, error, currentUserId } = await listStaffUsers();

  return (
    <StaffUsersWorkspace
      users={users}
      error={error}
      currentUserId={currentUserId}
    />
  );
}
