"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { FaGlobe } from "react-icons/fa";
import { Button } from "../../form/Button/Button";

interface LocaleSwitcherProps {
  className?: string;
}

export const LocaleSwitcher = ({ className }: LocaleSwitcherProps) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    router.replace(pathname, { locale: locale === "en" ? "pl" : "en" });
  };

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      <FaGlobe size={20} />
    </Button>
  );
};
