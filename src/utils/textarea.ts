import { KeyboardEvent } from "react";

export const submitOnEnter = (
  e: KeyboardEvent<HTMLTextAreaElement>,
  onSubmit: () => void,
) => {
  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault();
    onSubmit();
  }
};
