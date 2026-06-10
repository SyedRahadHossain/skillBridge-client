import { Route } from "@/types";

export const studentRoutes: Route[] = [
  {
    title: "My Dashboard",
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "My Bookings", url: "/dashboard/bookings" },
      { title: "Profile", url: "/dashboard/profile" },
    ],
  },
  {
    title: "Explore",
    items: [
      { title: "Browse Tutors", url: "/tutors" },
    ],
  },
];
