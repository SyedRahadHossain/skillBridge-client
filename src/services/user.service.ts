// import { env } from "@/env";
// import { cookies } from "next/headers";

// const AUTH_URL = env.AUTH_URL;
// const API_URL = env.API_URL;

// export const userService = {
//   getSession: async function () {
//     try {
//       const cookieStore = await cookies();
//       const res = await fetch(`${AUTH_URL}/get-session`, {
//         headers: { Cookie: cookieStore.toString() },
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!json) return { data: null, error: { message: "No session" } };
//       return { data: json, error: null };
//     } catch {
//       return { data: null, error: { message: "Something went wrong" } };
//     }
//   },

//   getMe: async function () {
//     try {
//       const cookieStore = await cookies();
//       const res = await fetch(`${API_URL}/users/me`, {
//         headers: { Cookie: cookieStore.toString() },
//         cache: "no-store",
//       });
//       const json = await res.json();
//       return { data: json ?? null, error: null };
//     } catch {
//       return { data: null, error: { message: "Something went wrong" } };
//     }
//   },
// };

import { env } from "@/env";
import { cookies, headers } from "next/headers";
// import { cookies, headers } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const headerStore = await headers();
      
      // Try cookie header first, fall back to forwarding all headers
      const cookieHeader = cookieStore.toString() || headerStore.get("cookie") || "";
      
      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: { 
          Cookie: cookieHeader,
          "user-agent": headerStore.get("user-agent") || "",
        },
        cache: "no-store",
      });
      const json = await res.json();
      if (!json?.user) return { data: null, error: { message: "No session" } };
      return { data: json, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getMe: async function () {
    try {
      const cookieStore = await cookies();
      const headerStore = await headers();
      const cookieHeader = cookieStore.toString() || headerStore.get("cookie") || "";

      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};