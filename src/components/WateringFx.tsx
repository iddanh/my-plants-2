import { useEffect } from 'react';

/**
 * Brief, self-contained watering-can animation shown as centered feedback when a
 * plant is watered. Pure SVG + CSS (no Lottie dependency, works offline).
 */
export function WateringFx({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fx-overlay" aria-hidden="true">
      <div className="fx-card flex flex-col items-center gap-1 rounded-2xl bg-white/95 px-6 py-5 shadow-xl ring-1 ring-green-100">
        <svg width="96" height="96" viewBox="0 0 120 120">
          <g className="fx-can">
            <path
              d="M70 44 C 74 26, 98 28, 98 50"
              fill="none"
              stroke="#15803d"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="60" y="44" width="46" height="40" rx="12" fill="#16a34a" />
            <rect x="64" y="38" width="38" height="10" rx="4" fill="#15803d" />
            <path d="M60 56 L24 44 L16 56 L58 74 Z" fill="#16a34a" />
            <path d="M12 40 L30 46 L24 60 L8 53 Z" fill="#15803d" />
          </g>
          <g fill="#38bdf8">
            <path className="fx-drop" style={{ animationDelay: '0.35s' }} d="M18 60 c-3 4 -3 7 0 9 c3 -2 3 -5 0 -9 z" />
            <path className="fx-drop" style={{ animationDelay: '0.6s' }} d="M25 62 c-3 4 -3 7 0 9 c3 -2 3 -5 0 -9 z" />
            <path className="fx-drop" style={{ animationDelay: '0.85s' }} d="M13 64 c-3 4 -3 7 0 9 c3 -2 3 -5 0 -9 z" />
          </g>
        </svg>
        <span className="text-sm font-semibold text-green-700">Watered!</span>
      </div>
    </div>
  );
}
