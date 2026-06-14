"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import ReviewForm from "./ReviewForm";

interface ExistingReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function BookingActions({
  booking,
  isStudent,
  isTutor,
  existingReview,
}: {
  booking: Booking;
  isStudent: boolean;
  isTutor: boolean;
  existingReview?: ExistingReview | null;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const updateStatus = async (status: string, setLoading: (v: boolean) => void) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${booking.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to update booking"); return; }
      toast.success(status === "cancelled" ? "Booking cancelled!" : "Marked as complete!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const hasActions =
    (isStudent && booking.status === "confirmed") ||
    (isTutor && booking.status === "confirmed") ||
    (isStudent && booking.status === "completed");

  if (!hasActions) return null;

  return (
    <div className="w-full">
      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        {isStudent && booking.status === "confirmed" && (
          <Button size="sm" variant="destructive" onClick={() => updateStatus("cancelled", setCancelling)} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel"}
          </Button>
        )}
        {isTutor && booking.status === "confirmed" && (
          <Button size="sm" variant="outline" onClick={() => updateStatus("completed", setCompleting)} disabled={completing}>
            {completing ? "Updating..." : "Mark Complete"}
          </Button>
        )}
        {isStudent && booking.status === "completed" && !existingReview && !showReview && (
          <Button size="sm" variant="outline" onClick={() => setShowReview(true)}>
            Leave Review
          </Button>
        )}
      </div>

      {/* Review — inline below booking info, full width */}
      {isStudent && booking.status === "completed" && (
        <>
          {existingReview && (
            <ReviewForm
              bookingId={booking.id}
              tutorProfileId={(booking.tutorProfile as any)?.id}
              existingReview={existingReview}
            />
          )}
          {showReview && !existingReview && (
            <ReviewForm
              bookingId={booking.id}
              tutorProfileId={(booking.tutorProfile as any)?.id}
              existingReview={null}
              onSuccess={() => setShowReview(false)}
            />
          )}
        </>
      )}
    </div>
  );
}