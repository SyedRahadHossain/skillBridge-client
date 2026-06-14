import { categoryService } from "@/services/category.service";
import { Category } from "@/types";
import CategoriesManager from "@/components/modules/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const { data: categories } = await categoryService.getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <CategoriesManager categories={categories || []} />
    </div>
  );
}
