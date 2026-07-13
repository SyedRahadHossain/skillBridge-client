// import { bookingService } from "@/services/booking.service";
// import { Booking } from "@/types";
// import BookingsManager from "@/components/modules/admin/BookingsManager";

// export default async function AdminBookingsPage() {
//   const { data } = await bookingService.getAllBookings();

//   const bookings: Booking[] = data?.data || [];
//   const total: number = data?.pagination?.total || 0;

//   return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-2xl font-bold">All Bookings</h1>
//       <BookingsManager bookings={bookings} total={total} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/types";
import BookingsManager from "@/components/modules/admin/BookingsManager";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bookings`, { credentials: "include" });
        const json = await res.json();
        const data = json?.data?.data ?? json?.data ?? [];
        const pagination = json?.data?.pagination ?? json?.pagination;
        setBookings(Array.isArray(data) ? data : []);
        setTotal(pagination?.total || data.length);
      } catch {} finally { setLoading(false); }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">All Bookings</h1>
      <BookingsManager bookings={bookings} total={total} />
    </div>
  );
}
