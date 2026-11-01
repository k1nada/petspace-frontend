"use client";

import { ReactNode, useState } from "react";
import cn from "classnames";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { Button } from "@/app/uikit/form/Button/Button";
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
import styles from "./Dropdown.module.scss";

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  items?: DropdownItem[];
  content?: ReactNode;
  openOn?: "click" | "hover";
  align?: "left" | "center" | "right";
  triggerAppearance?: "icon" | "button" | "iconButton";
  triggerClassName?: string;
  trigger?: ReactNode;
  label?: string;
  className?: string;
}

export const Dropdown = ({
  items = [],
  content,
  openOn = "click",
  align = "right",
  triggerAppearance = "icon",
  triggerClassName,
  trigger = <MdOutlineMoreHoriz size={25} />,
  label,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isButton = triggerAppearance === "button";
  const buttonClassName = isButton ? triggerClassName : styles.trigger;
  const isPopover = content !== undefined;

  return (
    <div
      className={cn(styles.wrapper, className, {
        [styles.hover]: openOn === "hover",
      })}
    >
      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      {openOn === "hover" && trigger}
      {openOn === "click" && triggerAppearance === "iconButton" && (
        <IconButton
          icon={trigger}
          label={label ?? ""}
          onClick={() => setIsOpen(true)}
        />
      )}
      {openOn === "click" && triggerAppearance !== "iconButton" && (
        <Button
          appearance={isButton ? "secondary" : "ghost"}
          className={cn(buttonClassName, {
            [styles.triggerActive]: isPopover && isOpen,
          })}
          title={label}
          onClick={() => setIsOpen(!isOpen)}
        >
          {trigger}
        </Button>
      )}

      <div
        className={cn(styles.menu, styles[align], { [styles.open]: isOpen })}
      >
        {content}
        {items.map((item) => (
          <Button
            key={item.label}
            appearance="secondary"
            onClick={() => {
              setIsOpen(false);
              item.onClick();
            }}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
