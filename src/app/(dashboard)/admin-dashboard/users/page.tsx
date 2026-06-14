import { adminService } from "@/services/admin.service";
import { User } from "@/types";
import UsersManager from "@/components/modules/admin/UsersManager";

export default async function AdminUsersPage() {
  const { data } = await adminService.getAllUsers();
  const users: User[] = data?.data || [];
  const total: number = data?.pagination?.total || 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <UsersManager users={users} total={total} />
    </div>
  );
}
