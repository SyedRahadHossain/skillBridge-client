import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const bookingService = {
  getMyBookings: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? [], error: null };
    } catch {
      return { data: [], error: { message: "Something went wrong" } };
    }
  },

  getBookingById: async function (id: number) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const json = await res.json();
      return { data: json ?? null, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getAllBookings: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/bookings`, {
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
