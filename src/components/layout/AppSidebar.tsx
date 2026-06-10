import Image from "next/image";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { adminRoutes } from "@/routes/adminRoutes";
import { studentRoutes } from "@/routes/studentRoutes";
import { tutorRoutes } from "@/routes/tutorRoutes";
import { Route } from "@/types";

const Logo = ({ size = 32 }: { size?: number }) => (
  <Image
    src="/logo.png"
    alt="SkillBridge"
    width={size}
    height={size}
    className=""
  />
);

export function AppSidebar({
  user,
  ...props
}: { user: { role: string } } & React.ComponentProps<typeof Sidebar>) {
  let routes: Route[] = [];

  if (user.role === "admin") routes = adminRoutes;
  else if (user.role === "tutor") routes = tutorRoutes;
  else routes = studentRoutes;

  return (
    // <Sidebar collapsible="offcanvas" className="w-[72vw] max-w-xs" {...props}>
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <div className="flex items-center px-4 py-4 border-b">
          <Link
            href="/"
            className="flex items-center font-bold text-base leading-none hover:opacity-80 transition-opacity truncate"
          >
            <Logo size={50} />
            <span>
              Skill<span className="text-primary">Bridge</span>
            </span>
          </Link>
        </div>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
