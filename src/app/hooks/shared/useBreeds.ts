import { useEffect, useState } from "react";
import { getBreedsClient } from "@/services/api/breeds";

export const useBreeds = () => {
  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    getBreedsClient().then(setBreeds);
  }, []);

  return breeds;
};
