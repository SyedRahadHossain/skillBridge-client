import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TutorProfile } from "@/types";

export default function TutorCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {tutor.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-lg">{tutor.user.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{tutor.rating.toFixed(1)}</span>
              <span>({tutor.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {tutor.bio || "Experienced tutor ready to help you learn."}
        </p>
        <div className="flex flex-wrap gap-1">
          {tutor.categories.slice(0, 3).map(({ category }) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div>
          <span className="text-lg font-bold">${tutor.hourlyRate}</span>
          <span className="text-sm text-muted-foreground">/hr</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
