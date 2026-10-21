import { isAxiosError } from "axios";

export const getUploadErrorKey = (error: unknown) => {
  if (!isAxiosError(error)) return "toasts.error";

  const type = error.response?.data?.type;
  if (type === "PHOTO_LIMIT_REACHED") return "errors.PHOTO_LIMIT_REACHED";
  if (type === "FILE_TOO_LARGE") return "errors.FILE_TOO_LARGE";
  return "toasts.error";
};
