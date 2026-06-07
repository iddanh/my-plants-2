import { useNavigate } from 'react-router-dom';
import type { Plant } from '../types';
import { computeUrgency } from '../lib/urgency';
import { thumbUrl } from '../lib/cloudinary';
import { formatRelativeDays } from '../lib/date';
import { UrgencyBadge } from './UrgencyBadge';
import { SplitWaterButton } from './SplitWaterButton';

interface Props {
  plant: Plant;
  onWater: (plant: Plant, daysAgo: number) => void;
}

export function PlantCard({ plant, onWater }: Props) {
  const navigate = useNavigate();
  const urgency = computeUrgency(plant);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/plant/${plant.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/plant/${plant.id}`);
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
    >
      <div className="aspect-square w-full overflow-hidden bg-green-50">
        {plant.imageUrl ? (
          <img
            src={thumbUrl(plant.imageUrl, 500)}
            alt={plant.name}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🪴</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">{plant.name}</h3>
          <UrgencyBadge urgency={urgency} />
        </div>
        <p className="text-sm text-gray-500">
          Watered {formatRelativeDays(plant.lastWateredAt).toLowerCase()}
        </p>
        <div className="mt-auto pt-1">
          <SplitWaterButton onWater={(daysAgo) => onWater(plant, daysAgo)} />
        </div>
      </div>
    </div>
  );
}
