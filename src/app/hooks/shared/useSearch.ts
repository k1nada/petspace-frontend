import { ROUTES } from "@/routes/routes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { User as UserType } from "@/types/index";
import { searchUsers } from "@/services/api/userClient";

const SEARCH_DELAY_MS = 300;

export const useSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchPathname, setSearchPathname] = useState(pathname);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);

  useEffect(() => {
    if (!query.trim()) return;
    let cancelled = false;

    const timer = setTimeout(() => {
      searchUsers(query)
        .then((data) => {
          if (!cancelled) setResults(data);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        });
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const search = (value: string) => {
    setSearchPathname(pathname);
    setQuery(value);
    if (!value.trim()) setResults([]);
  };

  const select = (username: string) => {
    setQuery("");
    setResults([]);
    router.push(ROUTES.profile(username));
  };

  const isOnSearchPage = searchPathname === pathname;

  return {
    query: isOnSearchPage ? query : "",
    results: isOnSearchPage ? results : [],
    search,
    select,
  };
};
