export const formatTime = (date: string | Date, locale = "en-US") =>
  new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (date: string | Date, locale = "en-US") =>
  new Date(date).toLocaleDateString(locale, { dateStyle: "medium" });

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_DAYS = 7;

const getDaysAgo = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - day.getTime()) / DAY_MS);
};

export const formatChatListDate = (
  date: string | Date,
  locale: string,
  yesterdayLabel: string,
) => {
  const value = new Date(date);
  const daysAgo = getDaysAgo(value);

  if (daysAgo === 0) return formatTime(value, locale);
  if (daysAgo === 1) return yesterdayLabel;
  if (daysAgo < WEEK_DAYS) {
    return value.toLocaleDateString(locale, { weekday: "short" });
  }
  if (value.getFullYear() === new Date().getFullYear()) {
    return value.toLocaleDateString(locale, { day: "numeric", month: "short" });
  }
  return value.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatChatDayLabel = (
  date: string | Date,
  locale: string,
  todayLabel: string,
  yesterdayLabel: string,
) => {
  const daysAgo = getDaysAgo(new Date(date));

  if (daysAgo === 0) return todayLabel;
  if (daysAgo === 1) return yesterdayLabel;
  return formatDate(date, locale);
};
