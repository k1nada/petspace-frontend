import api from "@/config/axios";

export const getCountries = () => api.get("/countries").then((res) => res.data);
export const getCities = (country: string) =>
  api
    .get(`/countries/cities?country=${encodeURIComponent(country)}`)
    .then((res) => res.data);
