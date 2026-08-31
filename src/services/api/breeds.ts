import api from "@/config/axios";

export const getBreeds = () => api.get("/breeds").then((res) => res.data);