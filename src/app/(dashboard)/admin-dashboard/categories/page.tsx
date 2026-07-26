"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types";
import CategoriesManager from "@/components/modules/admin/CategoriesManager";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      setCategories(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  if (loading) return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <CategoriesManager categories={categories} onRefresh={fetchCategories} />
    </div>
  );
}