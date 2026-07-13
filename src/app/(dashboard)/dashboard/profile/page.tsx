// import { userService } from "@/services/user.service";
// import { tutorService } from "@/services/tutor.service";
// import { categoryService } from "@/services/category.service";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import TutorProfileForm from "@/components/modules/dashboard/TutorProfileForm";
// import StudentProfileForm from "@/components/modules/dashboard/StudentProfileForm";
// import { Category } from "@/types";
// import { Star, BookOpen, Mail, Shield } from "lucide-react";

// export default async function ProfilePage() {
//   const { data: session } = await userService.getSession();
//   const user = session?.user as any;
//   const isTutor = user?.role === "tutor";
//   const isStudent = user?.role === "student";

//   let tutorProfile = null;
//   let categories: Category[] = [];

//   if (isTutor) {
//     const [profileRes, categoryRes] = await Promise.all([
//       tutorService.getMyTutorProfile(),
//       categoryService.getAllCategories(),
//     ]);
//     tutorProfile = profileRes.data;
//     categories = categoryRes.data || [];
//   }

//   const rating = (tutorProfile as any)?.rating;
//   const totalReviews = (tutorProfile as any)?.totalReviews;

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-2xl font-bold">My Profile</h1>
//         <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
//       </div>

//       {/* Account Info Card */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center gap-5">
//             {/* Avatar with online indicator */}
//             <div className="relative flex-shrink-0">
//               <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
//                 {user?.name?.charAt(0).toUpperCase()}
//               </div>
//               <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${user?.isActive ? "bg-green-500" : "bg-red-500"}`} />
//             </div>

//             {/* Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h2 className="font-bold text-xl">{user?.name}</h2>
//                 <Badge variant="secondary" className="capitalize text-xs">{user?.role}</Badge>
//               </div>
//               <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
//                 <Mail className="h-3.5 w-3.5" />
//                 {user?.email}
//               </div>
//               <div className="flex items-center gap-1.5 text-sm mt-1">
//                 <Shield className="h-3.5 w-3.5 text-muted-foreground" />
//                 <span className={user?.isActive ? "text-green-600 dark:text-green-400" : "text-destructive"}>
//                   {user?.isActive ? "Active account" : "Inactive account"}
//                 </span>
//               </div>

//               {/* Tutor stats */}
//               {isTutor && tutorProfile && (
//                 <div className="flex items-center gap-4 mt-3 pt-3 border-t">
//                   <div className="flex items-center gap-1.5 text-sm">
//                     <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
//                     <span className="font-semibold">{rating?.toFixed(1) ?? "—"}</span>
//                     <span className="text-muted-foreground">rating</span>
//                   </div>
//                   <div className="flex items-center gap-1.5 text-sm">
//                     <BookOpen className="h-3.5 w-3.5 text-primary" />
//                     <span className="font-semibold">{totalReviews ?? 0}</span>
//                     <span className="text-muted-foreground">reviews</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {isStudent && (
//         <StudentProfileForm
//           name={user?.name || ""}
//           email={user?.email || ""}
//           isActive={user?.isActive ?? true}
//         />
//       )}

//       {isTutor && (
//         <TutorProfileForm
//           categories={categories}
//           existing={tutorProfile ? {
//             bio: (tutorProfile as any).bio,
//             hourlyRate: (tutorProfile as any).hourlyRate,
//             experience: (tutorProfile as any).experience,
//             rating: (tutorProfile as any).rating,
//             totalReviews: (tutorProfile as any).totalReviews,
//             categoryIds: (tutorProfile as any).categories?.map((c: any) => c.category?.id ?? c.categoryId) || [],
//           } : undefined}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TutorProfileForm from "@/components/modules/dashboard/TutorProfileForm";
import StudentProfileForm from "@/components/modules/dashboard/StudentProfileForm";
import { Star, BookOpen, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const isTutor = user?.role === "tutor";
  const isStudent = user?.role === "student";

  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!isTutor) return;
    const fetchData = async () => {
      try {
        const [profileRes, categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors/profile/me`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`),
        ]);
        const profileJson = await profileRes.json();
        const categoryJson = await categoryRes.json();
        setTutorProfile(profileJson?.data ?? profileJson);
        setCategories(Array.isArray(categoryJson?.data) ? categoryJson.data : Array.isArray(categoryJson) ? categoryJson : []);
      } catch {}
    };
    fetchData();
  }, [isTutor]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${user?.isActive ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-xl">{user?.name}</h2>
                <Badge variant="secondary" className="capitalize text-xs">{user?.role}</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                <Mail className="h-3.5 w-3.5" />{user?.email}
              </div>
              <div className="flex items-center gap-1.5 text-sm mt-1">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className={user?.isActive ? "text-green-600 dark:text-green-400" : "text-destructive"}>
                  {user?.isActive ? "Active account" : "Inactive account"}
                </span>
              </div>
              {isTutor && tutorProfile && (
                <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tutorProfile?.rating?.toFixed(1) ?? "—"}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold">{tutorProfile?.totalReviews ?? 0}</span>
                    <span className="text-muted-foreground">reviews</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isStudent && (
        <StudentProfileForm name={user?.name || ""} email={user?.email || ""} isActive={user?.isActive ?? true} />
      )}

      {isTutor && (
        <TutorProfileForm
          categories={categories}
          existing={tutorProfile ? {
            bio: tutorProfile.bio,
            hourlyRate: tutorProfile.hourlyRate,
            experience: tutorProfile.experience,
            rating: tutorProfile.rating,
            totalReviews: tutorProfile.totalReviews,
            categoryIds: tutorProfile.categories?.map((c: any) => c.category?.id ?? c.categoryId) || [],
          } : undefined}
        />
      )}
    </div>
  );
}