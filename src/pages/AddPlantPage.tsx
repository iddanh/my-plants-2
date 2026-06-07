import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantForm } from '../components/PlantForm';
import { addPlant } from '../data/plants';
import type { PlantInput } from '../types';

export function AddPlantPage() {
  const navigate = useNavigate();

  async function handleSubmit(input: PlantInput) {
    const id = await addPlant(input);
    navigate(`/plant/${id}`, { replace: true });
  }

  return (
    <Layout title="Add plant" back>
      <div className="max-w-lg">
        <PlantForm submitLabel="Add plant" onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}
