"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { Pencil, Trash2, X, Check, Plus, Tag } from "lucide-react";

export default function CategoriesManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newName, icon: newIcon }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to create");
        return;
      }
      toast.success("Category added!");
      setNewName("");
      setNewIcon("");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || "");
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: editName, icon: editIcon }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update");
        return;
      }
      toast.success("Category updated!");
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to delete");
        return;
      }
      toast.success("Category deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add Category */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Add New Category</h3>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Name
              </label>
              <Input
                placeholder="e.g. Mathematics"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Icon
              </label>
              <Input
                placeholder="📐"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={adding}
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              {adding ? "Adding..." : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">All Categories</h3>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No categories yet. Add one above.
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                >
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-3">
                      <Input
                        className="w-16 h-8 text-sm"
                        value={editIcon}
                        onChange={(e) => setEditIcon(e.target.value)}
                        placeholder="icon"
                      />
                      <Input
                        className="flex-1 h-8 text-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUpdate(cat.id)
                        }
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center">
                        {cat.icon}
                      </span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    {editingId === cat.id ? (
                      <>
                        <Button
                          size="icon-sm"
                          onClick={() => handleUpdate(cat.id)}
                          className="h-7 w-7"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="h-7 w-7"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleEdit(cat)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDelete(cat.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
