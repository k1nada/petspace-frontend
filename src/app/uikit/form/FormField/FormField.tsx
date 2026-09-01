import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import styles from "./FormField.module.scss";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  hint,
  error,
  id,
  children,
}: FormFieldProps) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldWrapper}>
        <label htmlFor={id}>{label}</label>
        {hint && <small className={styles.hint}>{hint}</small>}
      </div>
      {children}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};
