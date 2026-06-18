import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User as UserType } from "@/types/index";
import api from "@/config/axios";

export const useSearch = () => {
  const router = useRouter();
  const [results, setResults] = useState<UserType[]>([]);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const { data } = await api.get(`/users/search?query=${query}`);
    setResults(data);
  };

  const select = (username: string) => {
    setResults([]);
    router.push(ROUTES.profile(username));
  };

  return { results, search, select };
};
