import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  back?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Layout({ title, back, action, children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex flex-col">
      <header className="safe-top sticky top-0 z-30 border-b border-green-100 bg-green-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          {back && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="-ml-1 rounded-lg p-1.5 text-gray-600 transition hover:bg-green-100"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <h1 className="flex items-center gap-2 truncate text-lg font-semibold text-gray-900">
            {!back && <span aria-hidden="true">🪴</span>}
            {title}
          </h1>
          <div className="ml-auto">{action}</div>
        </div>
      </header>

      <main className="safe-bottom mx-auto w-full max-w-4xl px-4 py-5 my-5">{children}</main>
    </div>
  );
}
