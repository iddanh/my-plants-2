export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Epoch ms for the start of the calendar day `n` days before today.
 * n = 0 → today, 1 → yesterday, etc.
 */
export function daysAgoStart(n: number): number {
  return startOfDay(new Date()).getTime() - n * MS_PER_DAY;
}

/** Whole calendar days between two instants (positive when `to` is later). */
export function calendarDaysBetween(fromMs: number, toMs: number): number {
  return Math.round((startOfDay(toMs).getTime() - startOfDay(fromMs).getTime()) / MS_PER_DAY);
}

/** Whole calendar days from the given instant until now. */
export function daysSince(ms: number, now: number = Date.now()): number {
  return calendarDaysBetween(ms, now);
}

/** Human-friendly "Today" / "Yesterday" / "N days ago" / "In N days". */
export function formatRelativeDays(ms: number, now: number = Date.now()): string {
  const diff = calendarDaysBetween(ms, now);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1) return `${diff} days ago`;
  if (diff === -1) return 'Tomorrow';
  return `In ${Math.abs(diff)} days`;
}

/** e.g. "Jun 7, 2026" */
export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
