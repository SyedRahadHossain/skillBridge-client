import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const adminService = {
  getStats: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getAllUsers: async function (page = 1, limit = 50) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users?page=${page}&limit=${limit}`, {
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
