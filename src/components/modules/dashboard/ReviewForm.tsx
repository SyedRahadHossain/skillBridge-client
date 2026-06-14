"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ExistingReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewFormProps {
  bookingId: number;
  tutorProfileId: number;
  existingReview?: ExistingReview | null;
  onSuccess?: () => void;
}

export default function ReviewForm({ bookingId, tutorProfileId, existingReview, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [loading, setLoading] = useState(false);

  if (existingReview) {
    return (
      <div className="mt-3 pt-3 border-t flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Review</p>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} className={`h-4 w-4 ${star <= existingReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          ))}
        </div>
        {existingReview.comment && (
          <p className="text-sm text-muted-foreground italic">"{existingReview.comment}"</p>
        )}
        <p className="text-xs text-muted-foreground">
          Submitted {new Date(existingReview.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookingId, tutorProfileId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to submit review"); return; }
      toast.success("Review submitted!");
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Leave a Review</p>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((star) => (
          <button key={star} type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
          >
            <Star className={`h-5 w-5 transition-colors cursor-pointer ${
              star <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`} />
          </button>
        ))}
      </div>
      <textarea
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-16 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Share your experience (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
        {onSuccess && (
          <Button size="sm" variant="ghost" onClick={onSuccess}>Cancel</Button>
        )}
      </div>
    </div>
  );
}