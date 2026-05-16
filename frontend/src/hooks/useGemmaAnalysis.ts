import { useState, useEffect, useRef, useCallback } from 'react';
import { useBiometrics } from '../contexts/BiometricsContext';

export interface GemmaResponse {
  reasoning: string;
  function_calls: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
}

/** Capture a JPEG frame from a <video> element via an off-screen canvas. */
function captureFrame(video: HTMLVideoElement): Promise<Blob | null> {
  return new Promise(resolve => {
    try {
      if (!video.videoWidth || !video.videoHeight) return resolve(null);
      const canvas = document.createElement('canvas');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
    } catch {
      resolve(null);
    }
  });
}

/**
 * The model streams raw JSON: {"reasoning": "actual text...", "function_calls": [...]}
 * Extracts only the text inside "reasoning" so the UI shows clean clinical prose.
 */
function extractReasoningFromStream(accumulated: string): string {
  // Full closed string
  const closed = accumulated.match(/"reasoning"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (closed) return closed[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  // Partial (still streaming)
  const partial = accumulated.match(/"reasoning"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (partial) return partial[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  return '';
}

export function useGemmaAnalysis(videoRef: React.RefObject<HTMLVideoElement | null> | undefined, patientHistory: string) {
  const { metrics, historicalData } = useBiometrics();

  // Refs so interval closure always reads fresh data without being a dep
  const metricsRef        = useRef(metrics);
  metricsRef.current      = metrics;

  const historicalDataRef = useRef(historicalData);
  historicalDataRef.current = historicalData;

  const patientHistoryRef = useRef(patientHistory);
  patientHistoryRef.current = patientHistory;

  // Track expression at time of last completed analysis — change triggers reset
  const lastExpressionRef = useRef<string>('');

  const [analysis, setAnalysis]           = useState<GemmaResponse | null>(null);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const lastAnalyzed = useRef<number>(0);
  const isRunning    = useRef(false);

  const runAnalysis = useCallback(async () => {
    if (isRunning.current) return;
    isRunning.current = true;
    setIsAnalyzing(true);
    setStreamingText('');
    setError(null);

    try {
      const currentMetrics = metricsRef.current;
      const historyLog = historicalDataRef.current.slice(-30);
      const formData = new FormData();
      formData.append('biometrics', JSON.stringify(currentMetrics));
      formData.append('biometrics_history', JSON.stringify(historyLog));
      formData.append('patient_history', patientHistoryRef.current);

      // Attach a live webcam frame if the video element is ready
      if (videoRef?.current) {
        const frame = await captureFrame(videoRef.current);
        if (frame) formData.append('image', frame, 'frame.jpg');
      }

      const response = await fetch('http://127.0.0.1:8000/api/analyze/stream', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer      = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.startsWith('data: ') ? part.slice(6) : part;
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);

            if (event.type === 'token') {
              accumulated += event.content;
              const reasoningText = extractReasoningFromStream(accumulated);
              if (reasoningText) setStreamingText(reasoningText);

            } else if (event.type === 'done') {
              const data: GemmaResponse = event.payload;
              setAnalysis(data);
              setStreamingText('');
              lastAnalyzed.current     = Date.now();
              // Record expression that was active when this analysis completed
              lastExpressionRef.current = metricsRef.current.expression ?? '';

              if (data.function_calls?.length > 0) {
                const channel = new BroadcastChannel('sensory-ai-actions');
                data.function_calls.forEach(call => {
                  channel.postMessage({ type: 'AI_ACTION', payload: call });
                });
                channel.close();
              }
            }
          } catch {
            // Ignore malformed SSE chunks
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsAnalyzing(false);
      isRunning.current = false;
    }
  }, [videoRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now        = Date.now();
      const current    = metricsRef.current;
      const expression = current.expression ?? '';
      const hr         = current.hr;
      const movement   = current.movement ?? '';

      const isExpressionAnomaly = expression !== 'Neutral' && expression !== '';
      const isHrAnomaly         = hr > 90 || hr < 50;
      const isMovementAnomaly   = movement !== 'Stable' && movement !== '';
      
      const isAnomaly = isExpressionAnomaly || isHrAnomaly || isMovementAnomaly;

      // Expression changed → wipe old result and re-analyze immediately
      const expressionChanged = expression !== lastExpressionRef.current && lastExpressionRef.current !== '';
      if (expressionChanged) {
        setAnalysis(null);
        setStreamingText('');
        lastAnalyzed.current = 0; // Reset cooldown so analysis fires now
      }

      const cooldownElapsed = now - lastAnalyzed.current >= 10000;
      if (cooldownElapsed && !isRunning.current && isAnomaly) {
        runAnalysis();
      }
    }, 1000); // Fast continuous check for anomalies

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAnalysis]);

  return { analysis, streamingText, isAnalyzing, error };
}
