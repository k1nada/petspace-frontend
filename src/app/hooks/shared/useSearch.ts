import { ROUTES } from "@/routes/routes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { User as UserType } from "@/types/index";
import { searchUsers } from "@/services/api/userClient";

const SEARCH_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 2;

interface FoundUsers {
  query: string;
  users: UserType[];
}

export const useSearch = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [searchPathname, setSearchPathname] = useState(pathname);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<FoundUsers>({ query: "", users: [] });

  const trimmedQuery = query.trim();
  const isQueryLongEnough = trimmedQuery.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isQueryLongEnough) return;
    let cancelled = false;

    const timer = setTimeout(() => {
      searchUsers(trimmedQuery)
        .then((users) => {
          if (!cancelled) setFound({ query: trimmedQuery, users });
        })
        .catch(() => {
          if (cancelled) return;
          setFound({ query: trimmedQuery, users: [] });
          toast.error(t("toasts.error"));
        });
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery, isQueryLongEnough, t]);

  const search = (value: string) => {
    setSearchPathname(pathname);
    setQuery(value);
  };

  const select = (username: string) => {
    setQuery("");
    router.push(ROUTES.profile(username));
  };

  const isOnSearchPage = searchPathname === pathname;
  const isFound = isQueryLongEnough && found.query === trimmedQuery;
  const results = isOnSearchPage && isFound ? found.users : [];
  const isLoading = isOnSearchPage && isQueryLongEnough && !isFound;
  const isEmpty = isOnSearchPage && isFound && results.length === 0;

  return {
    query: isOnSearchPage ? query : "",
    results,
    isLoading,
    isEmpty,
    isDropdownOpen: isLoading || isEmpty || results.length > 0,
    search,
    select,
  };
};
