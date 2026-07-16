import styles from "./CalendarDropdown.module.scss";
import type { DropdownProps } from "react-day-picker";
import { Select } from "../Select/Select";

export const CalendarDropdown = ({ options, value, onChange }: DropdownProps) => {
  const maxLabelLength = Math.max(
    1,
    ...(options ?? []).map((o) => o.label.length),
  );

  return (
    <div
      className={styles.dropdown}
      style={{ width: `calc(${maxLabelLength}ch + 56px)` }}
    >
      <Select
        value={String(value ?? "")}
        options={(options ?? []).map((o) => ({
          label: o.label,
          value: String(o.value),
        }))}
        onChange={(newValue) => {
          onChange?.({
            target: { value: newValue },
          } as React.ChangeEvent<HTMLSelectElement>);
        }}
      />
    </div>
  );
};