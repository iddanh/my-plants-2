import type { Plant, Urgency, UrgencyLevel } from '../types';
import { daysSince } from './date';

const LABELS: Record<UrgencyLevel, string> = {
  fine: 'Fine',
  soon: 'Water soon',
  due: 'Due',
  overdue: 'Overdue',
};

export function computeUrgency(plant: Plant, now: number = Date.now()): Urgency {
  const interval = Math.max(1, plant.wateringIntervalDays);
  const daysSinceWatered = daysSince(plant.lastWateredAt, now);
  const ratio = daysSinceWatered / interval;
  const daysUntilDue = interval - daysSinceWatered;

  let level: UrgencyLevel;
  if (ratio < 0.5) level = 'fine';
  else if (ratio < 1) level = 'soon';
  else if (ratio < 1.5) level = 'due';
  else level = 'overdue';

  return {
    level,
    ratio,
    daysSinceWatered,
    daysUntilDue,
    label: LABELS[level],
  };
}

/** Tailwind-friendly color tokens per urgency level. */
export const URGENCY_STYLES: Record<
  UrgencyLevel,
  { badge: string; ring: string; dot: string }
> = {
  fine: {
    badge: 'bg-green-100 text-green-800',
    ring: 'ring-green-200',
    dot: 'bg-green-500',
  },
  soon: {
    badge: 'bg-yellow-100 text-yellow-800',
    ring: 'ring-yellow-200',
    dot: 'bg-yellow-500',
  },
  due: {
    badge: 'bg-orange-100 text-orange-800',
    ring: 'ring-orange-200',
    dot: 'bg-orange-500',
  },
  overdue: {
    badge: 'bg-red-100 text-red-800',
    ring: 'ring-red-300',
    dot: 'bg-red-500',
  },
};

/** Lower = more urgent. Used for the default "Most urgent" sort. */
export function urgencySortKey(plant: Plant, now: number = Date.now()): number {
  return -computeUrgency(plant, now).ratio;
}
