import { Route } from "@/types";

export const tutorRoutes: Route[] = [
  {
    title: "My Dashboard",
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "My Bookings", url: "/dashboard/bookings" },
      { title: "Availability", url: "/dashboard/availability" },
      { title: "My Reviews", url: "/dashboard/reviews" },
      { title: "My Profile", url: "/dashboard/profile" },
    ],
  },
];