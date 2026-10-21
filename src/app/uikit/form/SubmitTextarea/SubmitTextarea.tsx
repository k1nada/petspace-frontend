import { Ref } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Textarea } from "../Textarea/Textarea";
import styles from "./SubmitTextarea.module.scss";
import { submitOnEnter } from "@/utils/textarea";

interface SubmitTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  textareaRef?: Ref<HTMLTextAreaElement>;
  autoFocus?: boolean;
}

export const SubmitTextarea = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  maxLength,
  disabled,
  textareaRef,
  autoFocus,
}: SubmitTextareaProps) => {
  return (
    <div className={styles.textareaWrapper}>
      <Textarea
        appearance="secondary"
        value={value}
        onKeyDown={disabled ? undefined : (e) => submitOnEnter(e, onSubmit)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        ref={textareaRef}
        autoFocus={autoFocus}
      />
      <FaAngleRight
        size={30}
        className={styles.arrow}
        onMouseDown={(e) => e.preventDefault()}
        onClick={disabled ? undefined : onSubmit}
      />
    </div>
  );
};
