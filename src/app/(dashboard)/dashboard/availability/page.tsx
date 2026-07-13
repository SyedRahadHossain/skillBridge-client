// import { tutorService } from "@/services/tutor.service";
// import { userService } from "@/services/user.service";
// import { redirect } from "next/navigation";
// import AvailabilityForm from "@/components/modules/dashboard/AvailabilityForm";

// export default async function AvailabilityPage() {
//   const { data: session } = await userService.getSession();
//   const user = session?.user as any;
//   if (user?.role !== "tutor") redirect("/dashboard");

//   const { data: tutorProfile } = await tutorService.getMyTutorProfile();
//   const existing = (tutorProfile as any)?.availability || [];

//   return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-2xl font-bold">My Availability</h1>
//       <p className="text-muted-foreground text-sm">
//         Set the days and times you are available for tutoring sessions.
//       </p>
//       <AvailabilityForm existing={existing} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import AvailabilityForm from "@/components/modules/dashboard/AvailabilityForm";

export default function AvailabilityPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const router = useRouter();
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "tutor") { router.replace("/dashboard"); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors/profile/me`, { credentials: "include" });
        const json = await res.json();
        const profile = json?.data ?? json;
        setAvailability(profile?.availability || []);
      } catch {} finally { setLoading(false); }
    };
    fetchProfile();
  }, [user?.role]);

  if (loading) return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">My Availability</h1>
      <p className="text-muted-foreground text-sm">Set the days and times you are available for tutoring sessions.</p>
      <AvailabilityForm existing={availability} />
    </div>
  );
}