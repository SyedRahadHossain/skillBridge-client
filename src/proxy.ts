// import { NextRequest, NextResponse } from "next/server";
// import { Roles } from "./constants/roles";

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Read cookies directly from the request (Edge Runtime compatible)
//   const cookieHeader = request.cookies
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");

//   let isAuthenticated = false;
//   let role = "";

//   try {
//     const authUrl = process.env.AUTH_URL || "http://localhost:5000/api/auth";
//     const res = await fetch(`${authUrl}/get-session`, {
//       headers: { Cookie: cookieHeader },
//       cache: "no-store",
//     });

//     if (res.ok) {
//       const session = await res.json();
//       if (session?.user) {
//         isAuthenticated = true;
//         role = (session.user as any).role || "";
//       }
//     }
//   } catch {
//     // If session check fails, treat as unauthenticated
//   }

//   // Not logged in — redirect to login
//   if (!isAuthenticated) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Admin trying to visit student/tutor dashboard
//   if (role === Roles.admin && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/admin-dashboard", request.url));
//   }

//   // Non-admin trying to visit admin dashboard
//   if (role !== Roles.admin && pathname.startsWith("/admin-dashboard")) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard", "/dashboard/:path*", "/admin-dashboard", "/admin-dashboard/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};