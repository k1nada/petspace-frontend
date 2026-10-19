import { useEffect, useState } from "react";
import { getCities, getCountries } from "@/services/api/locations";

export const useCountries = () => {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  return countries;
};

export const useCities = (country: string) => {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (!country) return;

    let cancelled = false;

    getCities(country)
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      });

    return () => {
      cancelled = true;
    };
  }, [country]);

  return country ? cities : [];
};
