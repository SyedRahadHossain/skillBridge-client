// import { tutorService } from "@/services/tutor.service";
// import { reviewService } from "@/services/review.service";
// import { userService } from "@/services/user.service";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Star, Clock, BookOpen } from "lucide-react";
// import BookingForm from "@/components/modules/tutors/BookingForm";
// import { Review } from "@/types";
// import { notFound } from "next/navigation";

// export default async function TutorDetailPage({ params }: { params: Promise<{ tutorId: string }> }) {
//   const { tutorId } = await params;

//   const [{ data: tutor }, { data: session }] = await Promise.all([
//     tutorService.getTutorById(tutorId),
//     userService.getSession(),
//   ]);

//   if (!tutor) return notFound();

//   const { data: reviews } = await reviewService.getReviewsByTutor(tutor.id);
//   const reviewList: Review[] = reviews || [];

//   const isLoggedIn = !!session?.user;
//   const isStudent = isLoggedIn && (session!.user as any).role === "student";

//   const avgRating = reviewList.length > 0
//     ? (reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length).toFixed(1)
//     : null;

//   const bookingCard = isStudent ? (
//     <BookingForm tutorProfileId={tutor.id} hourlyRate={tutor.hourlyRate} />
//   ) : (
//     <Card>
//       <CardContent className="p-6 text-center text-muted-foreground text-sm">
//         {isLoggedIn ? "Only students can book tutors." : "Log in as a student to book."}
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-12 max-w-4xl">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Booking — shows FIRST on mobile, right column on desktop */}
//         <div className="lg:hidden">{bookingCard}</div>

//         {/* Tutor Info */}
//         <div className="lg:col-span-2 flex flex-col gap-6">
//           <Card>
//             <CardContent className="p-5 sm:p-6">
//               <div className="flex items-start gap-4">
//                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-primary flex-shrink-0">
//                   {tutor.user?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-xl sm:text-2xl font-bold truncate">{tutor.user?.name}</h1>
//                   {avgRating && (
//                     <div className="flex items-center gap-1 mt-1">
//                       <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
//                       <span className="font-medium">{avgRating}</span>
//                       <span className="text-muted-foreground text-sm">({reviewList.length} reviews)</span>
//                     </div>
//                   )}
//                   <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
//                     <span className="flex items-center gap-1">
//                       <Clock className="h-3.5 w-3.5" /> {tutor.experience || 0} yrs experience
//                     </span>
//                     <span className="font-medium text-foreground">${tutor.hourlyRate}/hr</span>
//                   </div>
//                 </div>
//               </div>

//               {tutor.bio && (
//                 <div className="mt-4">
//                   <h3 className="font-semibold mb-1">About</h3>
//                   <p className="text-muted-foreground text-sm leading-relaxed">{tutor.bio}</p>
//                 </div>
//               )}

//               {tutor.categories?.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="font-semibold mb-2 flex items-center gap-1">
//                     <BookOpen className="h-4 w-4" /> Subjects
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {tutor.categories.map((cat: any) => (
//                       <Badge key={cat.category?.id ?? cat.categoryId} variant="secondary">
//                         {cat.category?.icon} {cat.category?.name}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Reviews */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-base">Reviews ({reviewList.length})</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {reviewList.length === 0 ? (
//                 <p className="text-muted-foreground text-sm">No reviews yet.</p>
//               ) : (
//                 <div className="flex flex-col gap-4">
//                   {reviewList.map((review) => (
//                     <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
//                       <div className="flex items-center justify-between mb-1 gap-2">
//                         <span className="font-medium text-sm truncate">{review.student.name}</span>
//                         <div className="flex items-center gap-0.5 flex-shrink-0">
//                           {[1,2,3,4,5].map((s) => (
//                             <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
//                           ))}
//                         </div>
//                       </div>
//                       {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
//                       <p className="text-xs text-muted-foreground mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Booking — desktop right column */}
//         <div className="hidden lg:block">{bookingCard}</div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, BookOpen } from "lucide-react";
import BookingForm from "@/components/modules/tutors/BookingForm";
import { Review } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`
  : "http://localhost:5000/api";

async function getTutorByIdClient(tutorId: string) {
  try {
    const res = await fetch(`${API_URL}/tutors/${tutorId}`, { cache: "no-store" });
    if (!res.ok) return { data: null, error: { message: "Not found" } };
    const json = await res.json();
    return { data: json ?? null, error: null };
  } catch {
    return { data: null, error: { message: "Something went wrong" } };
  }
}

async function getReviewsByTutorClient(tutorProfileId: number | string) {
  try {
    const res = await fetch(`${API_URL}/reviews/tutor/${tutorProfileId}`, {
      cache: "no-store",
    });
    const json = await res.json();
    return { data: json ?? [], error: null };
  } catch {
    return { data: [], error: { message: "Something went wrong" } };
  }
}

export default function TutorDetailPage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [tutor, setTutor] = useState<any>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      const { tutorId } = await params;
      const { data: tutorData } = await getTutorByIdClient(tutorId);

      if (!tutorData) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      const tutorObj = (tutorData as any)?.data ?? tutorData;
      setTutor(tutorObj);

      const { data: reviews } = await getReviewsByTutorClient(tutorObj.id);
      setReviewList(Array.isArray(reviews) ? reviews : (reviews as any)?.data ?? []);
      setLoading(false);
    })();
  }, [params]);

  if (loading || sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFoundFlag || !tutor) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-12 max-w-4xl text-center text-muted-foreground">
        Tutor not found.
      </div>
    );
  }

  const isLoggedIn = !!session?.user;
  const isStudent = isLoggedIn && (session!.user as any).role === "student";

  const avgRating =
    reviewList.length > 0
      ? (
          reviewList.reduce((sum, r: any) => sum + r.rating, 0) / reviewList.length
        ).toFixed(1)
      : null;

  const bookingCard = isStudent ? (
    <BookingForm tutorProfileId={tutor.id} hourlyRate={tutor.hourlyRate} />
  ) : (
    <Card>
      <CardContent className="p-6 text-center text-muted-foreground text-sm">
        {isLoggedIn ? "Only students can book tutors." : "Log in as a student to book."}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 pt-28 pb-12 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking — shows FIRST on mobile, right column on desktop */}
        <div className="lg:hidden">{bookingCard}</div>

        {/* Tutor Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-primary flex-shrink-0">
                  {tutor.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold truncate">
                    {tutor.user?.name}
                  </h1>
                  {avgRating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{avgRating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({reviewList.length} reviews)
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {tutor.experience || 0} yrs
                      experience
                    </span>
                    <span className="font-medium text-foreground">
                      ${tutor.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>

              {tutor.bio && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-1">About</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {tutor.categories?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.categories.map((cat: any) => (
                      <Badge key={cat.category?.id ?? cat.categoryId} variant="secondary">
                        {cat.category?.icon} {cat.category?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Reviews ({reviewList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewList.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reviews yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviewList.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-medium text-sm truncate">
                          {review.student.name}
                        </span>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s <= review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking — desktop right column */}
        <div className="hidden lg:block">{bookingCard}</div>
      </div>
    </div>
  );
}