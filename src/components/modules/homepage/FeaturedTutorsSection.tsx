import { tutorService } from "@/services/tutor.service";
import { TutorProfile } from "@/types";
import TutorCard from "@/components/modules/tutors/TutorCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function FeaturedTutorsSection() {
  const { data } = await tutorService.getAllTutors({ limit: 3 });

  // Backend returns { data: [...], pagination: {...} }
  // Service returns json (full response), so data.data = array of tutors
  const tutors: TutorProfile[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  if (tutors.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-medium text-sm mb-2 uppercase tracking-wide">Expert Educators</p>
            <h2 className="text-3xl md:text-4xl font-bold">Top Rated Tutors</h2>
          </div>
          <Button asChild variant="ghost" className="gap-2 text-primary hover:text-primary">
            <Link href="/tutors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </div>
    </section>
  );
}