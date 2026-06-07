import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantCard } from '../components/PlantCard';
import { SearchSortBar, type SortKey } from '../components/SearchSortBar';
import { usePlants } from '../hooks/usePlants';
import { waterPlant } from '../data/plants';
import { computeUrgency } from '../lib/urgency';
import { daysAgoStart } from '../lib/date';
import type { Plant } from '../types';

export function HomePage() {
  const { plants, loading, error } = usePlants();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('urgent');
  const [needsWaterOnly, setNeedsWaterOnly] = useState(false);

  const visible = useMemo(() => {
    const now = Date.now();
    const q = search.trim().toLowerCase();

    let list = plants.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.species?.toLowerCase().includes(q) ?? false);
      const matchesNeed = !needsWaterOnly || computeUrgency(p, now).ratio >= 1;
      return matchesSearch && matchesNeed;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return b.lastWateredAt - a.lastWateredAt;
        case 'leastRecent':
          return a.lastWateredAt - b.lastWateredAt;
        case 'urgent':
        default:
          return computeUrgency(b, now).ratio - computeUrgency(a, now).ratio;
      }
    });
    return list;
  }, [plants, search, sort, needsWaterOnly]);

  async function handleWater(plant: Plant, daysAgo: number) {
    try {
      await waterPlant(plant.id, daysAgoStart(daysAgo));
    } catch (err) {
      console.error('Failed to record watering', err);
    }
  }

  return (
    <Layout
      title="My Plants"
      action={
        <Link
          to="/add"
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">Add plant</span>
        </Link>
      }
    >
      {plants.length > 0 && (
        <div className="mb-5">
          <SearchSortBar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            needsWaterOnly={needsWaterOnly}
            onNeedsWaterChange={setNeedsWaterOnly}
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Couldn’t load plants: {error.message}
        </p>
      )}

      {loading ? (
        <Grid>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-white/70 ring-1 ring-gray-100"
            />
          ))}
        </Grid>
      ) : plants.length === 0 ? (
        <EmptyState />
      ) : visible.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No plants match your filters.</p>
      ) : (
        <Grid>
          {visible.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onWater={handleWater} />
          ))}
        </Grid>
      )}
    </Layout>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="text-5xl">🪴</div>
      <h2 className="text-lg font-semibold text-gray-900">No plants yet</h2>
      <p className="max-w-xs text-gray-500">
        Add your first plant to start tracking when it needs watering.
      </p>
      <Link
        to="/add"
        className="mt-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700"
      >
        Add a plant
      </Link>
    </div>
  );
}
