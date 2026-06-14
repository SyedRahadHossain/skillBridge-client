"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, CalendarDays, Clock, DollarSign } from "lucide-react";

export default function BookingsManager({ bookings, total }: { bookings: Booking[]; total: number }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleStatusChange = async (bookingId: number, status: string) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to update"); return; }
      toast.success(`Booking marked as ${status}!`);
      router.refresh();
    } catch { toast.error("Something went wrong"); }
    finally { setLoadingId(null); }
  };

  const statusConfig = {
    confirmed: "default" as const,
    completed: "secondary" as const,
    cancelled: "destructive" as const,
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">All Bookings</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{total}</span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-sm p-5">No bookings found.</p>
        ) : (
          <div className="divide-y">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3">
                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="text-sm font-medium flex flex-wrap items-center gap-1">
                    <span>{booking.student.name}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{booking.tutorProfile.user.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(booking.scheduledAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {booking.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Status + Select */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={statusConfig[booking.status as keyof typeof statusConfig] ?? "outline"} className="text-xs">
                    {booking.status}
                  </Badge>
                  <Select
                    value={booking.status}
                    onValueChange={(val) => handleStatusChange(booking.id, val)}
                    disabled={loadingId === booking.id}
                  >
                    <SelectTrigger className="w-32 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}