export function getTogetherDays(anniversary: string): number {
  const start = new Date(`${anniversary}T00:00:00`);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

export function formatDate(date: string): string {
  const parsed = parseDate(date);

  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric"
  }).format(parsed);
}

export function formatTime(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

function parseDate(date: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!dateOnly) {
    return new Date(date);
  }

  const [, year, month, day] = dateOnly;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
