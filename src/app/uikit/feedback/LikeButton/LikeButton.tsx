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
  const displayCount = count ?? "";

  return (
    <Button
      appearance="ghost"
      className={cn(className, styles.heart, { [styles.liked]: liked })}
      onClick={onToggle}
      disabled={loading}
    >
      <FaHeart size={16} />
      <span>{displayCount}</span>
    </Button>
  );
};
