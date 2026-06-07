import { useEffect, useMemo, useState } from 'react';
import { subscribePlants } from '../data/plants';
import type { Plant } from '../types';

interface PlantsState {
  plants: Plant[];
  loading: boolean;
  error: Error | null;
}

/** Live subscription to all plants (backed by Firestore's offline cache). */
export function usePlants(): PlantsState {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribePlants(
      (next) => {
        setPlants(next);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { plants, loading, error };
}

/** Live subscription narrowed to a single plant by id. */
export function usePlant(id: string | undefined): {
  plant: Plant | undefined;
  loading: boolean;
} {
  const { plants, loading } = usePlants();
  const plant = useMemo(() => plants.find((p) => p.id === id), [plants, id]);
  return { plant, loading };
}
