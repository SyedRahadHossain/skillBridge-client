import { userService } from "@/services/user.service";
import { reviewService } from "@/services/review.service";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default async function TutorReviewsPage() {
  const { data: session } = await userService.getSession();
  const user = session?.user as any;

  if (user?.role !== "tutor") redirect("/dashboard");

  // getMe returns user object with tutorProfile.id nested
  const { data: me } = await userService.getMe();
  const tutorProfileId = me?.tutorProfile?.id;

  if (!tutorProfileId) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Complete your tutor profile first to receive reviews.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: reviews } = await reviewService.getReviewsByTutor(tutorProfileId);
  const reviewList = Array.isArray(reviews) ? reviews : [];

  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length).toFixed(1)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviewList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-1">
              {avgRating ?? "—"}
              {avgRating && <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader><CardTitle>All Reviews</CardTitle></CardHeader>
        <CardContent>
          {reviewList.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No reviews yet.</p>
          ) : (
            <div className="flex flex-col divide-y">
              {reviewList.map((review: any) => (
                <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{review.student?.name}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
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
  );
}