
export default function formatDate(
  date,
  options = {}
) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  const {
    locale = "en-IN",
    dateStyle = "medium",
  } = options;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeZone: "UTC",
  }).format(parsedDate);
}

export function formatDateTime(
  date,
  locale = "en-IN"
) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatRelativeDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  const difference = parsedDate.getTime() - Date.now();
  const days = Math.round(difference / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (Math.abs(days) < 30) {
    return formatter.format(days, "day");
  }

  const months = Math.round(days / 30);

  if (Math.abs(months) < 12) {
    return formatter.format(months, "month");
  }

  return formatter.format(Math.round(days / 365), "year");
}