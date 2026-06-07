import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantForm } from '../components/PlantForm';
import { usePlant } from '../hooks/usePlants';
import { deletePlant, updatePlant } from '../data/plants';
import type { PlantInput } from '../types';

export function EditPlantPage() {
  const { id } = useParams<{ id: string }>();
  const { plant, loading } = usePlant(id);
  const navigate = useNavigate();

  if (loading && !plant) {
    return (
      <Layout title="Edit plant" back>
        <div className="h-64 max-w-lg animate-pulse rounded-2xl bg-white/70" />
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout title="Edit plant" back>
        <div className="py-16 text-center text-gray-500">
          <p>This plant doesn’t exist anymore.</p>
          <Link to="/" className="mt-3 inline-block text-green-700 underline">
            Back to all plants
          </Link>
        </div>
      </Layout>
    );
  }

  async function handleSubmit(input: PlantInput) {
    if (!plant) return;
    await updatePlant(plant.id, input);
    navigate('/', { replace: true });
  }

  async function handleDelete() {
    if (!plant) return;
    if (!window.confirm(`Delete “${plant.name}”? This can’t be undone.`)) return;
    try {
      await deletePlant(plant.id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete plant', err);
    }
  }

  return (
    <Layout title="Edit plant" back>
      <div className="max-w-lg">
        <PlantForm initial={plant} submitLabel="Save changes" onSubmit={handleSubmit} />
        <button
          type="button"
          onClick={handleDelete}
          className="mt-4 text-sm font-medium text-red-600 transition hover:text-red-700"
        >
          Delete plant
        </button>
      </div>
    </Layout>
  );
}
