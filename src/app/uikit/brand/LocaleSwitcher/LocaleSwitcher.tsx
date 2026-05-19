"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { FaGlobe } from "react-icons/fa";
import { Button } from "../../form/Button/Button";

interface LocaleSwitcherProps {
  className?: string;
}

export const LocaleSwitcher = ({ className }: LocaleSwitcherProps) => {
  const locale = useLocale();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "en" ? "pl" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    window.location.href = newPath;
  };

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      <FaGlobe size={20} />
    </Button>
  );
};
