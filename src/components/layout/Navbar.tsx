"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const menu = [
  { title: "Home", url: "/" },
  { title: "Tutors", url: "/tutors" },
];

const Logo = ({ size = 32 }: { size?: number }) => (
  <Image
    src="/logo.png"
    alt="SkillBridge"
    width={size}
    height={size}
    className=""
  />
);

export function Navbar({ className }: { className?: string }) {
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const getDashboardUrl = () => {
    if (!session) return "/login";
    if ((session.user as any).role === "admin") return "/admin-dashboard";
    return "/dashboard";
  };

  return (
    <div
      className={cn("fixed top-4 left-0 right-0 z-50 px-4 md:px-8", className)}
    >
      <header className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/20">
        <div className="px-4">
          {/* Desktop */}
          <nav className="hidden h-14 items-center justify-between lg:flex">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center font-bold text-lg">
                <Logo size={60} />
                <span>
                  Skill<span className="text-primary">Bridge</span>
                </span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.url}
                          className="inline-flex h-8 items-center px-3 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:bg-white/10 hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  {session && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href={getDashboardUrl()}
                          className="inline-flex h-8 items-center px-3 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:bg-white/10 hover:text-foreground"
                        >
                          Dashboard
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              {session ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    {session.user.name}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-white/20 hover:bg-white/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex h-12 items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center font-bold">
              <Logo size={50} />
              <span>
                Skill<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-white/20 bg-white/10"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex items-center">
                      <Logo size={50} />
                      Skill<span className="text-primary">Bridge</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4 mt-4">
                    <div className="flex flex-col gap-1">
                      {menu.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                      {session && (
                        <Link
                          href={getDashboardUrl()}
                          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      {session ? (
                        <>
                          <p className="text-sm text-muted-foreground px-3">
                            Signed in as {session.user.name}
                          </p>
                          <Button variant="outline" onClick={handleLogout}>
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href="/login">Login</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/register">Register</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
