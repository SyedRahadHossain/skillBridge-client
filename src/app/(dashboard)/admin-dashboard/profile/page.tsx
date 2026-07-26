"use client";

import { authClient } from "@/lib/auth-client";
import AdminProfileForm from "@/components/modules/admin/AdminProfileForm";

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;
  if (!session?.user) return <div className="p-4 text-muted-foreground text-sm">Not signed in.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <AdminProfileForm name={session.user.name} email={session.user.email} />
    </div>
  );
}