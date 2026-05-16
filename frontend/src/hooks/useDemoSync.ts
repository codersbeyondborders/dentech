import { useState, useEffect } from 'react';

export type DemoCase = 'normal' | 'medium' | 'extreme';

export function useDemoSync(): [DemoCase, (newCase: DemoCase) => void] {
  // Read initial state from URL if present
  const [currentCase, setCurrentCase] = useState<DemoCase>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('case') as DemoCase) || 'normal';
  });

  useEffect(() => {
    const channel = new BroadcastChannel('sensory-demo-sync');

    channel.onmessage = (event) => {
      if (event.data?.type === 'SET_CASE' && event.data?.payload) {
        setCurrentCase(event.data.payload);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const setSharedCase = (newCase: DemoCase) => {
    setCurrentCase(newCase);
    const channel = new BroadcastChannel('sensory-demo-sync');
    channel.postMessage({ type: 'SET_CASE', payload: newCase });
    channel.close();
    
    // Also politely update the URL locally for link sharing
    const url = new URL(window.location.href);
    url.searchParams.set('case', newCase);
    window.history.replaceState({}, '', url.toString());
  };

  return [currentCase, setSharedCase];
}
