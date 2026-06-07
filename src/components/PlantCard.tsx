import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plant } from '../types';
import { computeUrgency } from '../lib/urgency';
import { thumbUrl, viewUrl } from '../lib/cloudinary';
import { formatRelativeDays } from '../lib/date';
import { UrgencyBadge } from './UrgencyBadge';
import { SplitWaterButton } from './SplitWaterButton';
import { ImageModal } from './ImageModal';

interface Props {
  plant: Plant;
  onWater: (plant: Plant, daysAgo: number) => void;
}

export function PlantCard({ plant, onWater }: Props) {
  const navigate = useNavigate();
  const urgency = computeUrgency(plant);
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-green-50">
        {plant.imageUrl ? (
          <button
            type="button"
            onClick={() => setShowImage(true)}
            aria-label={`View photo of ${plant.name}`}
            className="group block h-full w-full cursor-zoom-in"
          >
            <img
              src={thumbUrl(plant.imageUrl, 500)}
              alt={plant.name}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-[1.03]"
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🪴</div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/plant/${plant.id}/edit`)}
          aria-label={`Edit ${plant.name}`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white hover:text-green-700"
        >
          <PencilIcon />
        </button>
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

      {showImage && plant.imageUrl && (
        <ImageModal
          src={viewUrl(plant.imageUrl)}
          alt={plant.name}
          onClose={() => setShowImage(false)}
        />
      )}
    </div>
  );
}

function PencilIcon() {
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
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
