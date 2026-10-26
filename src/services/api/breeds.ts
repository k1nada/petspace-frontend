import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const getBreeds = unstable_cache(
  () => api.get<string[]>("/breeds").then((res) => res.data),
  ["get-breeds"],
  { revalidate: 30 },
);

// used from client components/hooks, where unstable_cache is not available
export const getBreedsClient = () =>
  api.get<string[]>("/breeds").then((res) => res.data);
