import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Plant, PlantInput } from '../types';

const plantsRef = collection(db, 'plants');

function toPlant(id: string, data: Record<string, unknown>): Plant {
  return {
    id,
    name: (data.name as string) ?? '',
    imageUrl: (data.imageUrl as string) ?? '',
    imagePublicId: (data.imagePublicId as string) ?? '',
    wateringIntervalDays: (data.wateringIntervalDays as number) ?? 7,
    lastWateredAt: (data.lastWateredAt as number) ?? Date.now(),
    species: (data.species as string) || undefined,
    location: (data.location as string) || undefined,
    notes: (data.notes as string) || undefined,
    createdAt: (data.createdAt as number) ?? Date.now(),
    updatedAt: (data.updatedAt as number) ?? Date.now(),
  };
}

/** Drop undefined/empty optional fields so Firestore doesn't reject them. */
function clean<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== '') (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

/** Subscribe to all plants. Returns an unsubscribe function. */
export function subscribePlants(
  onData: (plants: Plant[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    plantsRef,
    (snap) => {
      const plants = snap.docs.map((d) => toPlant(d.id, d.data()));
      onData(plants);
    },
    (err) => onError?.(err),
  );
}

export async function addPlant(input: PlantInput): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(plantsRef, clean({ ...input, createdAt: now, updatedAt: now }));
  return ref.id;
}

export async function updatePlant(id: string, input: PlantInput): Promise<void> {
  await updateDoc(doc(db, 'plants', id), {
    ...clean(input),
    // Explicitly clear optional fields that were emptied in the form (null, not undefined).
    species: input.species || null,
    location: input.location || null,
    notes: input.notes || null,
    updatedAt: Date.now(),
  });
}

export async function waterPlant(id: string, wateredAtMs: number): Promise<void> {
  await updateDoc(doc(db, 'plants', id), {
    lastWateredAt: wateredAtMs,
    updatedAt: Date.now(),
  });
}

export async function deletePlant(id: string): Promise<void> {
  await deleteDoc(doc(db, 'plants', id));
}
