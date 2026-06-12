import { FaAngleRight } from "react-icons/fa";
import { Textarea } from "../Textarea/Textarea";
import styles from "./SubmitTextarea.module.scss";
import { useTextareaSubmit } from "@/app/hooks/useTextareaSubmit";

interface SubmitTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export const SubmitTextarea = ({
  value,
  onChange,
  onSubmit,
  placeholder,
}: SubmitTextareaProps) => {
  const { handleKeyDown } = useTextareaSubmit({ onSubmit });

  return (
    <div className={styles.textareaWrapper}>
      <Textarea
        appearance="secondary"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <FaAngleRight size={30} className={styles.arrow} onClick={onSubmit} />
    </div>
  );
};
