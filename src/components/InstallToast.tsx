import { useInstallPrompt } from '../hooks/useInstallPrompt';

/** Bottom toast suggesting PWA install; tapping "Install" triggers the native prompt. */
export function InstallToast() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <div className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-gray-200">
        <img
          src={`${import.meta.env.BASE_URL}icons/pwa-192.png`}
          alt=""
          className="h-10 w-10 flex-shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">Install My Plants</p>
          <p className="truncate text-xs text-gray-500">Add it to your home screen.</p>
        </div>
        <button
          type="button"
          onClick={promptInstall}
          className="flex-shrink-0 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
