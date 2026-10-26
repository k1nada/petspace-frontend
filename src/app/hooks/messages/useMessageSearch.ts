import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { searchMessages } from "@/services/api/conversations";
import { MessageSearchResult } from "@/types";

const SEARCH_DELAY_MS = 300;
export const MIN_MESSAGE_SEARCH_LENGTH = 2;

interface FoundMessages {
  query: string;
  messages: MessageSearchResult[];
}

export const useMessageSearch = (query: string) => {
  const t = useTranslations();
  const [found, setFound] = useState<FoundMessages>({
    query: "",
    messages: [],
  });

  const trimmedQuery = query.trim();
  const isQueryLongEnough = trimmedQuery.length >= MIN_MESSAGE_SEARCH_LENGTH;

  useEffect(() => {
    if (!isQueryLongEnough) return;
    let cancelled = false;

    const timer = setTimeout(() => {
      searchMessages(trimmedQuery)
        .then((messages) => {
          if (!cancelled) setFound({ query: trimmedQuery, messages });
        })
        .catch(() => {
          if (cancelled) return;
          setFound({ query: trimmedQuery, messages: [] });
          toast.error(t("toasts.error"));
        });
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery, isQueryLongEnough, t]);

  const isFound = isQueryLongEnough && found.query === trimmedQuery;

  return {
    messages: isFound ? found.messages : [],
    isLoading: isQueryLongEnough && !isFound,
  };
};
