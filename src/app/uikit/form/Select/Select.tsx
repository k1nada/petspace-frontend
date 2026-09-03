"use client";

import { useState } from "react";
import styles from "./Select.module.scss";
import { FaAngleDown } from "react-icons/fa";
import { Input } from "../Input/Input";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const toggle = () => !disabled && setIsOpen((p) => !p);

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <div className={styles.inputWrapper}>
        <Input
          appearance="wide"
          className={styles.input}
          value={selected?.label ?? ""}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={toggle}
        />
        <FaAngleDown className={styles.arrowIcon} size={20} onClick={toggle} />
      </div>
      {isOpen && !disabled && (
        <ul className={styles.dropdown}>
          {placeholder && (
            <li
              className={styles.option}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </li>
          )}
          {options.map((o) => (
            <li
              className={styles.option}
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setIsOpen(false);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
