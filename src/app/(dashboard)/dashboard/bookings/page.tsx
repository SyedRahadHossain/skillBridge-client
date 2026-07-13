// import { bookingService } from "@/services/booking.service";
// import { userService } from "@/services/user.service";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Booking } from "@/types";
// import BookingActions from "@/components/modules/dashboard/BookingActions";
// import { CalendarDays, Clock, DollarSign } from "lucide-react";

// export default async function BookingsPage() {
//   const [{ data: session }, { data: bookingsData }] = await Promise.all([
//     userService.getSession(),
//     bookingService.getMyBookings(),
//   ]);

//   const user = session?.user as any;
//   const isStudent = user?.role === "student";
//   const isTutor = user?.role === "tutor";
//   const allBookings: Booking[] = Array.isArray(bookingsData)
//     ? bookingsData
//     : bookingsData?.data || [];

//   const reviewMap: Record<number, any> = {};

//   if (isStudent) {
//     const completedBookings = allBookings.filter((b) => b.status === "completed");
//     const uniqueTutorIds = [
//       ...new Set(completedBookings.map((b) => (b.tutorProfile as any)?.id).filter(Boolean)),
//     ];
//     await Promise.all(
//       uniqueTutorIds.map(async (tutorProfileId) => {
//         try {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/tutor/${tutorProfileId}`,
//             { cache: "no-store" }
//           );
//           const json = await res.json();
//           const reviews: any[] = Array.isArray(json) ? json : json?.data || [];
//           reviews.forEach((review) => {
//             if (review.studentId === user.id) reviewMap[review.bookingId] = review;
//           });
//         } catch {}
//       })
//     );
//   }

//   const statusConfig = {
//     confirmed: { variant: "default" as const, dot: "bg-blue-500" },
//     completed: { variant: "secondary" as const, dot: "bg-green-500" },
//     cancelled: { variant: "destructive" as const, dot: "bg-red-500" },
//     pending: { variant: "outline" as const, dot: "bg-yellow-500" },
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-2xl font-bold">My Bookings</h1>
//         <p className="text-muted-foreground text-sm mt-1">
//           {allBookings.length} booking{allBookings.length !== 1 ? "s" : ""} total
//         </p>
//       </div>

//       {allBookings.length === 0 ? (
//         <Card>
//           <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
//             <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
//               <CalendarDays className="h-6 w-6 text-muted-foreground" />
//             </div>
//             <div>
//               <p className="font-medium">No bookings yet</p>
//               <p className="text-muted-foreground text-sm">Your sessions will appear here</p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {allBookings.map((booking) => {
//             const config = statusConfig[booking.status as keyof typeof statusConfig] ?? statusConfig.pending;
//             const personName = isStudent
//               ? (booking.tutorProfile as any)?.user?.name
//               : (booking.student as any)?.name;
//             const personLabel = isStudent ? "Tutor" : "Student";

//             return (
//               <Card key={booking.id} className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   {/* Top row: avatar + info left, badge right */}
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
//                         {personName?.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <div className="font-semibold text-sm">{personLabel}: {personName}</div>
//                         <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                           <span className="flex items-center gap-1">
//                             <CalendarDays className="h-3 w-3" />
//                             {new Date(booking.scheduledAt).toLocaleDateString()}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             {booking.duration} min
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <DollarSign className="h-3 w-3" />
//                             {booking.totalPrice}
//                           </span>
//                         </div>
//                         {(booking as any).subject && (
//                           <span className="text-xs text-muted-foreground">
//                             Subject: {(booking as any).subject}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <Badge variant={config.variant} className="flex items-center gap-1.5 shrink-0">
//                       <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
//                       {booking.status}
//                     </Badge>
//                   </div>

//                   {/* Actions + review below full width */}
//                   <BookingActions
//                     booking={booking}
//                     isStudent={isStudent}
//                     isTutor={isTutor}
//                     existingReview={reviewMap[booking.id] ?? null}
//                   />
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types";
import BookingActions from "@/components/modules/dashboard/BookingActions";
import { CalendarDays, Clock, DollarSign } from "lucide-react";

export default function BookingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const isStudent = user?.role === "student";
  const isTutor = user?.role === "tutor";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviewMap, setReviewMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
          credentials: "include",
          cache: "no-store",
        });
        const json = await res.json();
        const data: Booking[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        setBookings(data);

        if (user?.role === "student") {
          const completed = data.filter((b) => b.status === "completed");
          const uniqueTutorIds = [...new Set(completed.map((b) => (b.tutorProfile as any)?.id).filter(Boolean))];
          const map: Record<number, any> = {};
          await Promise.all(
            uniqueTutorIds.map(async (tutorProfileId) => {
              try {
                const r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/tutor/${tutorProfileId}`, { credentials: "include" });
                const rJson = await r.json();
                const reviews: any[] = Array.isArray(rJson?.data) ? rJson.data : Array.isArray(rJson) ? rJson : [];
                reviews.forEach((review) => {
                  if (review.studentId === user.id) map[review.bookingId] = review;
                });
              } catch {}
            })
          );
          setReviewMap(map);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user?.id, user?.role]);

  const statusConfig = {
    confirmed: { variant: "default" as const, dot: "bg-blue-500" },
    completed: { variant: "secondary" as const, dot: "bg-green-500" },
    cancelled: { variant: "destructive" as const, dot: "bg-red-500" },
    pending: { variant: "outline" as const, dot: "bg-yellow-500" },
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {loading ? "Loading..." : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} total`}
        </p>
      </div>

      {loading ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No bookings yet</p>
              <p className="text-muted-foreground text-sm">Your sessions will appear here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => {
            const config = statusConfig[booking.status as keyof typeof statusConfig] ?? statusConfig.pending;
            const personName = isStudent ? (booking.tutorProfile as any)?.user?.name : (booking.student as any)?.name;
            const personLabel = isStudent ? "Tutor" : "Student";
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {personName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold text-sm">{personLabel}: {personName}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.duration} min</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={config.variant} className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {booking.status}
                    </Badge>
                  </div>
                  <BookingActions booking={booking} isStudent={isStudent} isTutor={isTutor} existingReview={reviewMap[booking.id] ?? null} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}