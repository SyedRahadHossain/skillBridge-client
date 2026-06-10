import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface GetTutorsParams {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  page?: number;
  limit?: number;
}

export const tutorService = {
  getAllTutors: async function (params?: GetTutorsParams) {
    try {
      const url = new URL(`${API_URL}/tutors`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();

      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getTutorById: async function (tutorId: string) {
    try {
      const res = await fetch(`${API_URL}/tutors/${tutorId}`, {
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getMyTutorProfile: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/profile/me`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      // return { data: json ?? null, error: null };
      return { data: json?.data ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};
