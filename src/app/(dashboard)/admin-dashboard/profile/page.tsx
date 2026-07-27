"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminProfileForm from "@/components/modules/admin/AdminProfileForm";
import { Mail, Shield, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  useEffect(() => {
    if (user?.name) setNameValue(user.name);
  }, [user?.name]);

  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (nameValue === user?.name) {
      setEditingName(false);
      return;
    }
    setNameLoading(true);
    try {
      const { error } = await authClient.updateUser({ name: nameValue });
      if (error) {
        toast.error(error.message || "Failed to update name");
        return;
      }
      toast.success("Name updated!");
      setEditingName(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setNameLoading(false);
    }
  };

  if (isPending)
    return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;
  if (!session?.user)
    return (
      <div className="p-4 text-muted-foreground text-sm">Not signed in.</div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account details
        </p>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Inline name edit */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="h-8 text-lg font-bold w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setEditingName(false);
                          setNameValue(user?.name || "");
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleSaveName}
                      disabled={nameLoading}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingName(false);
                        setNameValue(user?.name || "");
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-xl">{user?.name}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-green-500 hover:opacity-70 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <Badge variant="secondary" className="capitalize text-xs">
                  {user?.role}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                <Mail className="h-3.5 w-3.5" />
                {user?.email}
              </div>
              <div className="flex items-center gap-1.5 text-sm mt-1">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-green-600 dark:text-green-400">
                  Active account
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminProfileForm/>
    </div>
  );
}
