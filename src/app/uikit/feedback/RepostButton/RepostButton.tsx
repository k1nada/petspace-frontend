import { FaReply } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import cn from "classnames";
import styles from "./RepostButton.module.scss";

interface RepostButtonProps {
  reposted: boolean;
  count: number;
  loading?: boolean;
  onToggle: () => void;
  className?: string;
}

export const RepostButton = ({
  reposted,
  count,
  loading,
  onToggle,
  className,
}: RepostButtonProps) => {
  const showCount = count > 0;

  return (
    <Button
      appearance="minimal"
      className={cn(className, styles.repost, { [styles.reposted]: reposted })}
      onClick={onToggle}
      disabled={loading}
    >
      <FaReply size={16} />
      {showCount && <span className={styles.count}>{count}</span>}
    </Button>
  );
};
