import { FaAngleRight } from "react-icons/fa";
import { Textarea } from "../Textarea/Textarea";
import styles from "./SubmitTextarea.module.scss";
import { useTextareaSubmit } from "@/app/hooks/shared/useTextareaSubmit";

interface SubmitTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const SubmitTextarea = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  maxLength,
  disabled,
}: SubmitTextareaProps) => {
  const { handleKeyDown } = useTextareaSubmit({ onSubmit });

  return (
    <div className={styles.textareaWrapper}>
      <Textarea
        appearance="secondary"
        value={value}
        onKeyDown={disabled ? undefined : handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
      />
      <FaAngleRight
        size={30}
        className={styles.arrow}
        onClick={disabled ? undefined : onSubmit}
      />
    </div>
  );
};
