// import { adminService } from "@/services/admin.service";
// import { User } from "@/types";
// import UsersManager from "@/components/modules/admin/UsersManager";

// export default async function AdminUsersPage() {
//   const { data } = await adminService.getAllUsers();
//   const users: User[] = data?.data || [];
//   const total: number = data?.pagination?.total || 0;

//   return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-2xl font-bold">Manage Users</h1>
//       <UsersManager users={users} total={total} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import UsersManager from "@/components/modules/admin/UsersManager";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`, { credentials: "include" });
      const json = await res.json();
      const data = json?.data?.data ?? json?.data ?? [];
      const pagination = json?.data?.pagination ?? json?.pagination;
      setUsers(Array.isArray(data) ? data : []);
      setTotal(pagination?.total || data.length);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <UsersManager users={users} total={total} />
    </div>
  );
}