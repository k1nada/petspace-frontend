import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const getBreeds = unstable_cache(
  () => api.get("/breeds").then((res) => res.data),
  ["get-breeds"],
  { revalidate: 30 },
);
