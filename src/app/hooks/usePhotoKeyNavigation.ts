import { useCallback } from "react";

interface UsePhotoKeyNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
}

export const usePhotoKeyNavigation = ({
  onPrev,
  onNext,
}: UsePhotoKeyNavigationProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    },
    [onPrev, onNext],
  );

  return { handleKeyDown };
};
