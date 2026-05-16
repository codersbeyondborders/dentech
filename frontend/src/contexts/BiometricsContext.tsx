import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useDemoSync } from '../hooks/useDemoSync';
import { useWebBluetooth } from '../hooks/useWebBluetooth';

export interface Biometrics {
  hr: number;
  skinTemp: number;
  expression: string;
  movement: string;
}

export interface MetricPoint extends Biometrics {
  time: number;
}

interface BiometricsContextProps {
  metrics: Biometrics;
  historicalData: MetricPoint[];
  setCVOverrides: (expression: string | null, movement: string | null) => void;
  btDevice: BluetoothDevice | null;
  btIsConnecting: boolean;
  btError: string | null;
  connectWearable: () => Promise<void>;
  disconnectWearable: () => void;
}

const defaultBiometrics: Biometrics = { hr: 75, skinTemp: 98.6, expression: 'Neutral', movement: 'Stable' };

const BiometricsContext = createContext<BiometricsContextProps>({
  metrics: defaultBiometrics,
  historicalData: [],
  setCVOverrides: () => {},
  btDevice: null,
  btIsConnecting: false,
  btError: null,
  connectWearable: async () => {},
  disconnectWearable: () => {},
});

export function BiometricsProvider({ children }: { children: React.ReactNode }) {
  const [currentCase] = useDemoSync();
  const [metrics, setMetrics] = useState<Biometrics>(defaultBiometrics);
  const [historicalData, setHistoricalData] = useState<MetricPoint[]>([]);
  const [cvOverrides, setCvOverrides] = useState<{ expression: string | null, movement: string | null }>({ expression: null, movement: null });

  // Web Bluetooth integration
  const { device, heartRate: btHr, skinTemp: btTemp, isConnecting, error, connect, disconnect } = useWebBluetooth();

  // Channel to listen for cross-tab CV updates (Patient View syncs with Dentist View)
  useEffect(() => {
    const channel = new BroadcastChannel('sensory-cv-sync');
    channel.onmessage = (event) => {
      if (event.data?.type === 'SET_CV' && event.data?.payload) {
        setCvOverrides(event.data.payload);
      }
    };
    return () => channel.close();
  }, []);

  // We initialize the context with some pre-filled historical data so charts don't look empty
  useEffect(() => {
    const initialData: MetricPoint[] = [];
    for (let i = 0; i < 40; i++) {
       initialData.push({
         time: i,
         hr: 70 + Math.random() * 10,
         skinTemp: 98.2 + Math.random() * 0.8,
         expression: 'Neutral',
         movement: 'Stable'
       });
    }
    setHistoricalData(initialData);
  }, []);

  const latestOverride = useRef(cvOverrides);
  latestOverride.current = cvOverrides;

  const latestCase = useRef(currentCase);
  latestCase.current = currentCase;

  const latestBt = useRef({ btHr, btTemp });
  latestBt.current = { btHr, btTemp };

  useEffect(() => {
    // Generate deterministic fake data continuously every 1s without resetting interval on every state update
    const intervalId = setInterval(() => {
      const timeHash = Math.floor(Date.now() / 1000); 
      
      let baseHr = 75;
      let baseTemp = 98.6;
      let exp = 'Neutral';
      let move = 'Stable';

      if (latestCase.current === 'medium') {
        baseHr = 95;
        baseTemp = 98.0;
        exp = 'Frowning';
        move = 'Tense / Fidgeting';
      } else if (latestCase.current === 'extreme') {
        baseHr = 125;
        baseTemp = 97.2;
        exp = 'Panic / Wide Eyes';
        move = 'Guarded / Erratic';
      }

      const noise1 = Math.sin(timeHash * 1.5) * 5 + Math.cos(timeHash * 3.1) * 3;
      const noise2 = Math.cos(timeHash * 0.8) * 0.5 + Math.sin(timeHash * 2.2) * 0.2;

      setMetrics(() => {
        const newMetrics: Biometrics = {
          hr: latestBt.current.btHr !== null ? latestBt.current.btHr : Math.round(baseHr + noise1),
          skinTemp: latestBt.current.btTemp !== null ? latestBt.current.btTemp : Number((baseTemp + noise2).toFixed(1)),
          expression: latestOverride.current.expression || exp,
          movement: latestOverride.current.movement || move,
        };

        setHistoricalData(hPrev => {
          const newData = [...hPrev.slice(1)];
          const lastTime = newData[newData.length - 1]?.time || 0;
          newData.push({ time: lastTime + 1, ...newMetrics });
          return newData;
        });

        return newMetrics;
      });

    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Ensure instant updates to visual metrics when any related state (cvOverrides, etc.) changes
  useEffect(() => {
      let exp = 'Neutral';
      let move = 'Stable';

      if (currentCase === 'medium') {
        exp = 'Frowning';
        move = 'Tense / Fidgeting';
      } else if (currentCase === 'extreme') {
        exp = 'Panic / Wide Eyes';
        move = 'Guarded / Erratic';
      }
      
      setMetrics(prev => ({
          ...prev,
          hr: btHr !== null ? btHr : prev.hr,
          skinTemp: btTemp !== null ? btTemp : prev.skinTemp,
          expression: cvOverrides.expression || exp,
          movement: cvOverrides.movement || move,
      }));
  }, [cvOverrides, btHr, btTemp, currentCase]);

  const handleSetCVOverrides = useCallback((expression: string | null, movement: string | null) => {
    setCvOverrides(prev => {
      if (prev.expression === expression && prev.movement === movement) return prev;
      
      const newOverrides = { expression, movement };
      
      // Sync CV state changes across tabs
      const channel = new BroadcastChannel('sensory-cv-sync');
      channel.postMessage({ type: 'SET_CV', payload: newOverrides });
      channel.close();
      
      return newOverrides;
    });
  }, []);

  return (
    <BiometricsContext.Provider value={{ 
      metrics, 
      historicalData, 
      setCVOverrides: handleSetCVOverrides,
      btDevice: device,
      btIsConnecting: isConnecting,
      btError: error,
      connectWearable: connect,
      disconnectWearable: disconnect
    }}>
      {children}
    </BiometricsContext.Provider>
  );
}

export function useBiometrics() {
  return useContext(BiometricsContext);
}
