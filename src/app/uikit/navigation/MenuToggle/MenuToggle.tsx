"use client";

import { FaBars } from "react-icons/fa";
import { Button } from "../../form/Button/Button";
import { useMobileMenuStore } from "@/app/hooks/shared/useMobileMenuStore";

interface MenuToggleProps {
  className?: string;
}

export const MenuToggle = ({ className }: MenuToggleProps) => {
  const toggle = useMobileMenuStore((state) => state.toggle);

  return (
    <Button appearance="ghost" className={className} onClick={toggle}>
      <FaBars size={20} />
    </Button>
  );
};
