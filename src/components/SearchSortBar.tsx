export type SortKey = 'urgent' | 'name' | 'recent' | 'leastRecent';

export const SORT_LABELS: Record<SortKey, string> = {
  urgent: 'Most urgent',
  name: 'Name (A–Z)',
  recent: 'Recently watered',
  leastRecent: 'Least recently watered',
};

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  needsWaterOnly: boolean;
  onNeedsWaterChange: (v: boolean) => void;
}

export function SearchSortBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  needsWaterOnly,
  onNeedsWaterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search plants…"
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
        />
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
      >
        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>

      <label className="flex select-none items-center gap-2 whitespace-nowrap text-sm text-gray-700">
        <input
          type="checkbox"
          checked={needsWaterOnly}
          onChange={(e) => onNeedsWaterChange(e.target.checked)}
          className="h-4 w-4 rounded accent-green-600"
        />
        Needs water
      </label>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
