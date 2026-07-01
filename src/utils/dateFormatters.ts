export const formatTime = (date: string | Date, locale = "en-US") =>
  new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
export const formatDate = (date: string | Date, locale = "en-US") =>
  new Date(date).toLocaleDateString(locale, { dateStyle: "medium" });

export const formatDateLong = (date: string | Date, locale = "en-US") =>
  new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
