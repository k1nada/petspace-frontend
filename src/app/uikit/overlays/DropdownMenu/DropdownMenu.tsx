"use client";

import styles from "./DropdownMenu.module.scss";
import { ReactNode, useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { Button } from "../../form/Button/Button";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface DropdownMenuProps {
  items: DropdownItem[];
}

export const DropdownMenu = ({ items }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <Button
        appearance="ghost"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
      >
        <MdOutlineMoreHoriz size={25} />
      </Button>
      {isOpen && (
        <ul className={styles.dropdown}>
          {items.map((item) => (
            <li
              key={item.label}
              className={styles.item}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
