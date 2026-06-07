import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { InstallToast } from './components/InstallToast';

// Lazy-load the form/crop-heavy pages so the home grid loads first.
const PlantDetailPage = lazy(() =>
  import('./pages/PlantDetailPage').then((m) => ({ default: m.PlantDetailPage })),
);
const AddPlantPage = lazy(() =>
  import('./pages/AddPlantPage').then((m) => ({ default: m.AddPlantPage })),
);
const EditPlantPage = lazy(() =>
  import('./pages/EditPlantPage').then((m) => ({ default: m.EditPlantPage })),
);

function Loading() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 text-gray-500">
      <div className="text-4xl">🪴</div>
      <p className="text-sm">Loading…</p>
    </div>
  );
}

export default function App() {
  const { ready, error } = useAuth();

  if (error) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-lg font-semibold text-gray-900">Couldn’t start the app</p>
        <p className="max-w-sm text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddPlantPage />} />
            <Route path="/plant/:id" element={<PlantDetailPage />} />
            <Route path="/plant/:id/edit" element={<EditPlantPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
      <InstallToast />
    </>
  );
}
