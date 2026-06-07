import { useEffect, useRef, useState } from 'react';

interface Props {
  onWater: (daysAgo: number) => void;
  disabled?: boolean;
  /** Full width on the detail page; auto on cards. */
  block?: boolean;
}

const OPTIONS = [
  { label: 'Yesterday', daysAgo: 1 },
  { label: '2 days ago', daysAgo: 2 },
  { label: '3 days ago', daysAgo: 3 },
];

/**
 * Split button: the large part marks "watered today"; the caret opens a menu
 * to record watering 1–3 days ago.
 */
export function SplitWaterButton({ onWater, disabled, block }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={ref}
      className={`relative inline-flex ${block ? 'w-full' : ''}`}
      onClick={stop}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          stop(e);
          onWater(0);
        }}
        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-l-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:bg-green-800 disabled:opacity-50 ${
          block ? '' : 'whitespace-nowrap'
        }`}
      >
        <DropletIcon />
        Water
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-label="Water on an earlier day"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          stop(e);
          setOpen((v) => !v);
        }}
        className="inline-flex items-center justify-center rounded-r-lg border-l border-green-700/40 bg-green-600 px-2 py-2 text-white transition hover:bg-green-700 active:bg-green-800 disabled:opacity-50"
      >
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.daysAgo}
              type="button"
              role="menuitem"
              onClick={(e) => {
                stop(e);
                setOpen(false);
                onWater(opt.daysAgo);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DropletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
