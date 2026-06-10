import { env } from "@/env";

const API_URL = env.API_URL;

export const categoryService = {
  getAllCategories: async function () {
    try {
      const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
      const json = await res.json();
      return { data: json ?? [], error: null };
    } catch {
      return { data: [], error: { message: "Something went wrong" } };
    }
  },
};
