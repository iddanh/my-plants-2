import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { SplitWaterButton } from '../components/SplitWaterButton';
import { usePlant } from '../hooks/usePlants';
import { deletePlant, waterPlant } from '../data/plants';
import { computeUrgency } from '../lib/urgency';
import { thumbUrl } from '../lib/cloudinary';
import { daysAgoStart, formatDate, formatRelativeDays } from '../lib/date';

export function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { plant, loading } = usePlant(id);
  const navigate = useNavigate();

  if (loading && !plant) {
    return (
      <Layout title="Plant" back>
        <div className="aspect-square w-full max-w-md animate-pulse rounded-2xl bg-white/70" />
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout title="Plant" back>
        <div className="py-16 text-center text-gray-500">
          <p>This plant doesn’t exist anymore.</p>
          <Link to="/" className="mt-3 inline-block text-green-700 underline">
            Back to all plants
          </Link>
        </div>
      </Layout>
    );
  }

  const urgency = computeUrgency(plant);
  const dueText =
    urgency.daysUntilDue > 0
      ? `Due in ${urgency.daysUntilDue} day${urgency.daysUntilDue === 1 ? '' : 's'}`
      : urgency.daysUntilDue === 0
        ? 'Due today'
        : `Overdue by ${Math.abs(urgency.daysUntilDue)} day${Math.abs(urgency.daysUntilDue) === 1 ? '' : 's'}`;

  async function handleWater(daysAgo: number) {
    if (!plant) return;
    try {
      await waterPlant(plant.id, daysAgoStart(daysAgo));
    } catch (err) {
      console.error('Failed to record watering', err);
    }
  }

  async function handleDelete() {
    if (!plant) return;
    if (!window.confirm(`Delete “${plant.name}”? This can’t be undone.`)) return;
    try {
      await deletePlant(plant.id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete plant', err);
    }
  }

  return (
    <Layout
      title={plant.name}
      back
      action={
        <Link
          to={`/plant/${plant.id}/edit`}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Edit
        </Link>
      }
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="w-full overflow-hidden rounded-2xl bg-green-50 md:max-w-sm">
          {plant.imageUrl ? (
            <img
              src={thumbUrl(plant.imageUrl, 800)}
              alt={plant.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-6xl">🪴</div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <UrgencyBadge urgency={urgency} />
            <span className="text-sm text-gray-500">{dueText}</span>
          </div>

          <dl className="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2">
            <Info label="Last watered">
              {formatRelativeDays(plant.lastWateredAt)} · {formatDate(plant.lastWateredAt)}
            </Info>
            <Info label="Watering schedule">Every {plant.wateringIntervalDays} days</Info>
            {plant.species && <Info label="Species">{plant.species}</Info>}
            {plant.location && <Info label="Location">{plant.location}</Info>}
          </dl>

          {plant.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="mt-1 whitespace-pre-wrap text-gray-800">{plant.notes}</p>
            </div>
          )}

          <div className="mt-2 max-w-xs">
            <SplitWaterButton onWater={handleWater} block />
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 self-start text-sm font-medium text-red-600 transition hover:text-red-700"
          >
            Delete plant
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{children}</dd>
    </div>
  );
}
