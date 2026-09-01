import { FaComment } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import cn from "classnames";
import styles from "./CommentButton.module.scss";

interface CommentButtonProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export const CommentButton = ({
  count,
  onClick,
  className,
}: CommentButtonProps) => {
  const showCount = count > 0;

  return (
    <Button
      appearance="minimal"
      className={cn(className, styles.comment)}
      onClick={onClick}
    >
      <FaComment size={16} />
      {showCount && <span className={styles.count}>{count}</span>}
    </Button>
  );
};
