"use client";

import { FaGlobe } from "react-icons/fa";
import { Button } from "../../form/Button/Button";
import { useToggleLocale } from "@/app/hooks/shared/useToggleLocale";

interface LocaleSwitcherProps {
  className?: string;
}

export const LocaleSwitcher = ({ className }: LocaleSwitcherProps) => {
  const toggle = useToggleLocale();

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      <FaGlobe size={20} />
    </Button>
  );
};
