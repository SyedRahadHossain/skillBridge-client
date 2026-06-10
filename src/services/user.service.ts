import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      if (!json) return { data: null, error: { message: "No session" } };
      return { data: json, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getMe: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};
