import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { User as UserType } from "@/types/index";
import { searchUsers } from "@/services/api/user";

export const useSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const latestQuery = useRef("");

  const search = async (value: string) => {
    setQuery(value);
    latestQuery.current = value;

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const data = await searchUsers(value);

    if (latestQuery.current === value) {
      setResults(data);
    }
  };

  const select = (username: string) => {
    setQuery("");
    setResults([]);
    router.push(ROUTES.profile(username));
  };

  return { query, results, search, select };
};
