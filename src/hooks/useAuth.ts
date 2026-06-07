import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthState {
  ready: boolean;
  error: Error | null;
}

/**
 * Invisible anonymous auth: signs in silently on load so Firestore rules
 * (which require an auth token) are satisfied. No login UI is shown.
 */
export function useAuth(): AuthState {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setReady(true);
      } else {
        signInAnonymously(auth).catch((err) => setError(err as Error));
      }
    });
    return unsub;
  }, []);

  return { ready, error };
}
