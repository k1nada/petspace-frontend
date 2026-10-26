import api from "@/config/axios";

export const getCountries = () =>
  api.get<string[]>("/countries").then((res) => res.data);
export const getCities = (country: string) =>
  api
    .get<string[]>(`/countries/cities?country=${encodeURIComponent(country)}`)
    .then((res) => res.data);
