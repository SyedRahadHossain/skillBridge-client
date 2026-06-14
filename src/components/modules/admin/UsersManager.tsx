"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

export default function UsersManager({
  users,
  total,
}: {
  users: User[];
  total: number;
}) {
  const router = useRouter();

  const updateUser = async (
    userId: string,
    data: { isActive?: boolean; role?: string },
    successMsg: string,
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed");
        return;
      }
      toast.success(successMsg);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">All Users</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {total}
          </span>
        </div>

        <div className="divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={user.isActive ? "default" : "destructive"}
                  className="text-xs"
                >
                  {user.isActive ? "Active" : "Banned"}
                </Badge>

                {user.role !== "admin" && (
                  <>
                    <Select
                      value={user.role}
                      onValueChange={(val) =>
                        updateUser(
                          user.id,
                          { role: val },
                          `Role changed to ${val}!`,
                        )
                      }
                    >
                      <SelectTrigger className="h-7 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant={user.isActive ? "destructive" : "outline"}
                      onClick={() =>
                        updateUser(
                          user.id,
                          { isActive: !user.isActive },
                          user.isActive ? "User banned!" : "User unbanned!",
                        )
                      }
                      className="h-7 text-xs px-2.5"
                    >
                      {user.isActive ? "Ban" : "Unban"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
