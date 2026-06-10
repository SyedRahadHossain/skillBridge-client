import { tutorService } from "@/services/tutor.service";
import { categoryService } from "@/services/category.service";
import { TutorProfile } from "@/types";
import TutorCard from "@/components/modules/tutors/TutorCard";
import TutorFilters from "@/components/modules/tutors/TutorFilters";

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const [{ data: tutorsData }, { data: categories }] = await Promise.all([
    tutorService.getAllTutors({
      search: params.search,
      categoryId: params.categoryId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.minRating,
      page: params.page ? Number(params.page) : 1,
    }),
    categoryService.getAllCategories(),
  ]);

  // tutorsData = { tutors: TutorProfile[], pagination: {...} }
  // const tutors: TutorProfile[] = tutorsData?.tutors || [];
  // const total: number = tutorsData?.pagination?.total || 0;
  const tutors: TutorProfile[] = tutorsData?.data || [];
  const total: number = tutorsData?.pagination?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Tutor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TutorFilters categories={categories || []} />
        </div>
        <div className="lg:col-span-3">
          <p className="text-muted-foreground mb-4">{total} tutors found</p>
          {tutors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tutors found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
