import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await userService.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const { data: me } = await userService.getMe();

  if (me?.isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Account Banned</h1>
          <p className="text-muted-foreground mb-6">
            Your account has been suspended by an administrator. If you believe
            this is a mistake, please contact support.
          </p>
          <a href="/login" className="text-primary underline text-sm">
            Sign out
          </a>
        </div>
      </div>
    );
  }

  const user = me ?? (session.user as any);

  return (
    <SidebarProvider
      // defaultOpen={false}
      // style={{ "--sidebar-width": "70vw" } as React.CSSProperties}
    >
      <AppSidebar user={{ role: user.role }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto text-sm text-muted-foreground">
            {user.name} · <span className="capitalize">{user.role}</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
