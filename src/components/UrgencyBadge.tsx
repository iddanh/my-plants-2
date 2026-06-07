import type { Urgency } from '../types';
import { URGENCY_STYLES } from '../lib/urgency';

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const style = URGENCY_STYLES[urgency.level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {urgency.label}
    </span>
  );
}
