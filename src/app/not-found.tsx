import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8">
          <div className="absolute inset-0">
            <div className="text-6xl">🎓</div>
          </div>
          <div className="text-[10rem] font-black leading-none text-primary/10 select-none">
            404
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Looks like this lesson does not exist. The page you are looking for
          may have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tutors" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Tutors
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
