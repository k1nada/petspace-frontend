"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export const useToggleLocale = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return () => {
    router.replace(pathname, { locale: locale === "en" ? "pl" : "en" });
  };
};
