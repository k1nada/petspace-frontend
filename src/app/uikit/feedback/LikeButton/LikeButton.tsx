import { FaHeart } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import cn from "classnames";
import styles from "./LikeButton.module.scss";

interface LikeButtonProps {
  liked: boolean;
  count: number | null;
  loading?: boolean;
  onToggle: () => void;
  className?: string;
}

export const LikeButton = ({
  liked,
  count,
  loading,
  onToggle,
  className,
}: LikeButtonProps) => {
  const displayCount = count ?? 0;
  const showCount = displayCount > 0;

  return (
    <Button
      appearance="minimal"
      className={cn(className, styles.heart, { [styles.liked]: liked })}
      onClick={onToggle}
      disabled={loading}
    >
      <FaHeart size={16} />
      {showCount && <span className={styles.count}>{displayCount}</span>}
    </Button>
  );
};
