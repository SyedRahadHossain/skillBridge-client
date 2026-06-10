import Image from "next/image";

import Link from "next/link";

const Logo = ({ size = 32 }: { size?: number }) => (
  <Image
    src="/logo.png"
    alt="SkillBridge"
    width={size}
    height={size}
    className=""
  />
);

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-3">
              <Logo size={50} />
              <span className="font-bold text-lg">
                Skill<span className="text-primary">Bridge</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Connecting learners with expert tutors worldwide. Learn any
              subject, at your own pace, on your own schedule.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/tutors"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Tutors
              </Link>
              <Link
                href="/register"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Become a Tutor
              </Link>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Popular Subjects</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted-foreground">
                📐 Mathematics
              </span>
              <span className="text-sm text-muted-foreground">
                💻 Programming
              </span>
              <span className="text-sm text-muted-foreground">🔬 Physics</span>
              <span className="text-sm text-muted-foreground">📚 English</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </span>
          <span>Built for learners everywhere.</span>
          <span>
            <a href="https://www.facebook.com/ArchSun.IT" target="_blank">
              Developed by <span className="text-primary">ArchSun IT</span>
            </a>{" "}
          </span>
        </div>
      </div>
    </footer>
  );
}
