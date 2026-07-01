"use client";

import { DayPicker } from "react-day-picker";
import styles from "./DatePicker.module.scss";
import { useState } from "react";
import { Input } from "../Input/Input";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import type { Dayjs } from "dayjs";
import { pl, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

interface DatePickerProps {
  value: string | Date | Dayjs | undefined;
  onChange: (date: Dayjs | undefined) => void;
  fromYear?: number;
}

export const DatePicker = ({
  value,
  onChange,
  fromYear = 2000,
}: DatePickerProps) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const localeCode = useLocale();
  const isPolish = localeCode === "pl";

  const dateValue = value ? dayjs(value) : undefined;

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <Input
        appearance="wide"
        placeholder={t("placeholder.chooseDate")}
        readOnly
        value={
          dateValue
            ? dateValue.locale(isPolish ? "pl" : "en").format("D MMMM YYYY")
            : ""
        }
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className={styles.dropdown}>
          <DayPicker
            className={styles.picker}
            mode="single"
            selected={dateValue?.toDate()}
            onSelect={(date) => {
              onChange(date ? dayjs(date) : undefined);
              setIsOpen(false);
            }}
            captionLayout="dropdown"
            fromYear={fromYear}
            toYear={new Date().getFullYear()}
            disabled={{ after: new Date() }}
            locale={isPolish ? pl : enUS}
          />
        </div>
      )}
    </div>
  );
};
