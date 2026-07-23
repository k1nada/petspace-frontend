import { useEffect, useState } from "react";
import { getBreeds } from "@/app/api/breeds";

export const useBreeds = () => {
  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    getBreeds().then(setBreeds);
  }, []);

  return breeds;
};
