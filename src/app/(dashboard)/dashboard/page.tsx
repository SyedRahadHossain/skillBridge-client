// import { userService } from "@/services/user.service";
// import { bookingService } from "@/services/booking.service";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
// import { Booking } from "@/types";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default async function DashboardPage() {
//   const [{ data: session }, { data: bookings }] = await Promise.all([
//     userService.getSession(),
//     bookingService.getMyBookings(),
//   ]);

//   const user = session?.user as any;
//   const isStudent = user?.role === "student";
//   const allBookings: Booking[] = Array.isArray(bookings) ? bookings : [];

//   const confirmed = allBookings.filter((b) => b.status === "confirmed").length;
//   const completed = allBookings.filter((b) => b.status === "completed").length;
//   const cancelled = allBookings.filter((b) => b.status === "cancelled").length;
//   const recent = allBookings.slice(0, 5);

//   const stats = [
//     { label: "Total", value: allBookings.length, icon: BookOpen, color: "text-primary" },
//     { label: "Confirmed", value: confirmed, icon: Clock, color: "text-blue-500" },
//     { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-500" },
//     { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-destructive" },
//   ];

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
//           <p className="text-muted-foreground text-sm capitalize">{user?.role} account</p>
//         </div>
//         {isStudent && (
//           <Button asChild size="sm">
//             <Link href="/tutors">Browse Tutors</Link>
//           </Button>
//         )}
//       </div>

//       {/* Stat cards — compact */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         {stats.map((stat) => (
//           <Card key={stat.label}>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
//                 <stat.icon className={`h-4 w-4 ${stat.color}`} />
//               </div>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Bookings */}
//       <Card>
//         <CardContent className="p-0">
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <h2 className="font-semibold text-sm">Recent Bookings</h2>
//             <Button asChild variant="ghost" size="sm" className="text-xs h-7">
//               <Link href="/dashboard/bookings">View all</Link>
//             </Button>
//           </div>
//           {recent.length === 0 ? (
//             <p className="text-muted-foreground text-sm p-4">No bookings yet.</p>
//           ) : (
//             <div className="divide-y">
//               {recent.map((booking) => (
//                 <div key={booking.id} className="flex items-center justify-between px-4 py-3">
//                   <div>
//                     <div className="font-medium text-sm">
//                       {isStudent ? booking.tutorProfile?.user?.name : booking.student?.name}
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-0.5">
//                       {new Date(booking.scheduledAt).toLocaleDateString()} · {booking.duration} min · ${booking.totalPrice}
//                     </div>
//                   </div>
//                   <Badge
//                     variant={
//                       booking.status === "confirmed" ? "default" :
//                       booking.status === "completed" ? "secondary" : "destructive"
//                     }
//                     className="text-xs"
//                   >
//                     {booking.status}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { Booking } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const isStudent = user?.role === "student";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );
        const json = await res.json();
        const data = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const recent = bookings.slice(0, 5);

  const stats = [
    {
      label: "Total",
      value: bookings.length,
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground text-sm capitalize">
            {user?.role} account
          </p>
        </div>
        {isStudent && (
          <Button asChild size="sm">
            <Link href="/tutors">Browse Tutors</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">
                {loading ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  stat.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-sm">Recent Bookings</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs h-7">
              <Link href="/dashboard/bookings">View all</Link>
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground text-sm p-4">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-muted-foreground text-sm p-4">
              No bookings yet.
            </p>
          ) : (
            <div className="divide-y">
              {recent.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {isStudent
                        ? (booking.tutorProfile as any)?.user?.name
                        : (booking.student as any)?.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(booking.scheduledAt).toLocaleDateString()} ·{" "}
                      {booking.duration} min · ${booking.totalPrice}
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "default"
                        : booking.status === "completed"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
