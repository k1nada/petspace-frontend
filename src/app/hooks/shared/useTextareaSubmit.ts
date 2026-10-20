interface UseTextareaSubmitProps {
  onSubmit: () => void;
}

export const useTextareaSubmit = ({ onSubmit }: UseTextareaSubmitProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };

  return { handleKeyDown };
};
