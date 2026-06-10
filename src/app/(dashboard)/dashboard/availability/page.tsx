import { tutorService } from "@/services/tutor.service";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import AvailabilityForm from "@/components/modules/dashboard/AvailabilityForm";

export default async function AvailabilityPage() {
  const { data: session } = await userService.getSession();
  const user = session?.user as any;
  if (user?.role !== "tutor") redirect("/dashboard");

  const { data: tutorProfile } = await tutorService.getMyTutorProfile();
  const existing = (tutorProfile as any)?.availability || [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">My Availability</h1>
      <p className="text-muted-foreground text-sm">
        Set the days and times you are available for tutoring sessions.
      </p>
      <AvailabilityForm existing={existing} />
    </div>
  );
}
