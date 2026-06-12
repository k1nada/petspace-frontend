import { useCallback } from "react";

interface UseTextareaSubmitProps {
  onSubmit: () => void;
}

export const useTextareaSubmit = ({ onSubmit }: UseTextareaSubmitProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit],
  );

  return { handleKeyDown };
};
