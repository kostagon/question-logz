export const getDate = (
  daysAgo: number,
  hours: number = 12,
  minutes: number = 0
) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getInitials(email: string) {
  const base = email.split("@")[0];
  return (base[0] || "").toUpperCase();
}
