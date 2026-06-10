import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Star, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.1); }
          66%       { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(-40px, 20px) scale(0.95); }
          66%       { transform: translate(30px, -30px) scale(1.1); }
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ccircle cx='1' cy='1' r='1' fill='%236366f1' fill-opacity='0.25'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Animated glow blobs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          style={{ animation: "blob1 6s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl"
          style={{ animation: "blob2 8s ease-in-out infinite" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, hsl(var(--background)) 90%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Star className="h-3.5 w-3.5 fill-primary" />
            Trusted by 10,000+ students worldwide
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center mb-6 leading-tight">
          Find Your{" "}
          <span className="relative inline-block">
            <span className="text-primary">Perfect Tutor</span>
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 9C50 4 100 2 150 4C200 6 250 8 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/40" />
            </svg>
          </span>
        </h1>

        <p className="text-base md:text-xl text-muted-foreground text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with expert tutors in any subject. Learn at your own pace, on your own schedule — from anywhere.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button asChild size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/25 w-full sm:w-auto">
            <Link href="/tutors">
              <Search className="h-4 w-4" />
              Browse Tutors
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 h-12 text-base w-full sm:w-auto">
            <Link href="/register">
              <Users className="h-4 w-4 mr-2" />
              Become a Tutor
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>4.9/5 average rating</span>
          </div>
          <span className="hidden sm:block text-border">|</span>
          <span className="hidden sm:block">No subscription required</span>
          <span className="hidden sm:block text-border">|</span>
          <span className="hidden sm:block">Cancel anytime</span>
        </div>
      </div>
    </section>
  );
}