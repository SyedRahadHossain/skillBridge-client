import { Route } from "@/types";

export const adminRoutes: Route[] = [
  {
    title: "Admin Panel",
    items: [
      { title: "Dashboard", url: "/admin-dashboard" },
      { title: "Users", url: "/admin-dashboard/users" },
      { title: "Bookings", url: "/admin-dashboard/bookings" },
      { title: "Categories", url: "/admin-dashboard/categories" },
    ],
  },
];
