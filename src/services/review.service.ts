import { env } from "@/env";

const API_URL = env.API_URL;

export const reviewService = {
  getReviewsByTutor: async function (tutorProfileId: number) {
    try {
      const res = await fetch(`${API_URL}/reviews/tutor/${tutorProfileId}`, { cache: "no-store" });
      const json = await res.json();
      return { data: json ?? [], error: null };
    } catch {
      return { data: [], error: { message: "Something went wrong" } };
    }
  },
};
