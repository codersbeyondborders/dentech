import { useState, useEffect, useRef } from 'react';
import { getApiBaseUrl } from '../utils/apiConfig';

export type DemoCase = 'normal' | 'medium' | 'extreme';

export function useDemoSync(): [DemoCase, (newCase: DemoCase) => void] {
  const [currentCase, setCurrentCase] = useState<DemoCase>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('case') as DemoCase) || 'normal';
  });

  // Use a ref so the interval callback always sees the latest value
  // without needing to be torn down and recreated on every state change.
  const currentCaseRef = useRef(currentCase);
  useEffect(() => { currentCaseRef.current = currentCase; }, [currentCase]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/state`);
        if (res.ok) {
          const data = await res.json();
          if (data.current_case && data.current_case !== currentCaseRef.current) {
            setCurrentCase(data.current_case as DemoCase);

            // Sync URL too
            const url = new URL(window.location.href);
            url.searchParams.set('case', data.current_case);
            window.history.replaceState({}, '', url.toString());
          }
        }
      } catch (err) {
        // Silently ignore polling errors to prevent console spam
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Run once — ref keeps it fresh

  const setSharedCase = async (newCase: DemoCase) => {
    setCurrentCase(newCase);

    try {
      await fetch(`${getApiBaseUrl()}/api/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_case: newCase })
      });
    } catch (err) {
      console.error('Failed to sync case state', err);
    }

    // Also update the URL locally for link sharing
    const url = new URL(window.location.href);
    url.searchParams.set('case', newCase);
    window.history.replaceState({}, '', url.toString());
  };

  return [currentCase, setSharedCase];
}
