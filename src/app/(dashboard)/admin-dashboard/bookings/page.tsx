import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import BookingsManager from "@/components/modules/admin/BookingsManager";

export default async function AdminBookingsPage() {
  const { data } = await bookingService.getAllBookings();

  const bookings: Booking[] = data?.data || [];
  const total: number = data?.pagination?.total || 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">All Bookings</h1>
      <BookingsManager bookings={bookings} total={total} />
    </div>
  );
}
