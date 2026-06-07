export interface Plant {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId: string;
  wateringIntervalDays: number;
  /** When the plant was last watered (epoch milliseconds). */
  lastWateredAt: number;
  species?: string;
  location?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

/** Data captured by the add/edit form, before persistence. */
export interface PlantInput {
  name: string;
  wateringIntervalDays: number;
  lastWateredAt: number;
  species?: string;
  location?: string;
  notes?: string;
  imageUrl: string;
  imagePublicId: string;
}

export type UrgencyLevel = 'fine' | 'soon' | 'due' | 'overdue';

export interface Urgency {
  level: UrgencyLevel;
  /** daysSinceWatered / wateringIntervalDays */
  ratio: number;
  daysSinceWatered: number;
  /** Negative when overdue. */
  daysUntilDue: number;
  label: string;
}
