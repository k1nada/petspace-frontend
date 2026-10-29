import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const getBreeds = unstable_cache(
  () => api.get<string[]>("/breeds").then((res) => res.data),
  ["get-breeds"],
  { revalidate: 30 },
);

export const getBreedsClient = () =>
  api.get<string[]>("/breeds").then((res) => res.data);
