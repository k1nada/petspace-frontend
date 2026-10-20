import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/utils/dayjs";
import {
  UserPresence,
  UserWithPresence,
  usePresenceStore,
} from "./usePresenceStore";

export const useUserPresence = (user?: UserWithPresence): UserPresence => {
  const stored = usePresenceStore((state) =>
    user?.id ? state.presenceByUserId[user.id] : undefined,
  );
  if (stored) return stored;
  return { isOnline: user?.isOnline ?? false, lastSeen: user?.lastSeen };
};

export const useLastSeenText = (lastSeen?: string): string | null => {
  const t = useTranslations();
  const locale = useLocale();

  if (!lastSeen) return null;
  return t("friends.lastSeen", {
    time: dayjs(lastSeen).locale(locale).fromNow(),
  });
};
