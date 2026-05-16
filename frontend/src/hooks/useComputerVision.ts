import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useComputerVision() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [expression, setExpression] = useState<string | null>(null);
  const [movement, setMovement] = useState<string | null>(null);
  
  // Keep track of previous nose y-positions to calculate delta (movement)
  const pastPositions = useRef<number[]>([]);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let requestRef: number;
    let isActive = true;

    async function setupMediaPipe() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        if (!isActive) {
          faceLandmarker.close();
          return;
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (!isActive) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          if (videoRef.current && isActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener('loadeddata', predictWebcam);
          }
        }
      } catch (err) {
        console.error("Error setting up MediaPipe CV Framework:", err);
      }
    }

    let lastVideoTime = -1;
    let lastProcessTime = performance.now();
    
    function predictWebcam() {
      if (!isActive || !videoRef.current || !faceLandmarker) return;

      if (videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0) {
        requestRef = requestAnimationFrame(predictWebcam);
        return;
      }

      const now = performance.now();
      // Throttle CV processing to ~5 FPS (every 200ms) to prevent UI thread lockup
      if (now - lastProcessTime >= 200 && videoRef.current.currentTime !== lastVideoTime) {
        lastProcessTime = now;
        lastVideoTime = videoRef.current.currentTime;
        let results;
        try {
          results = faceLandmarker.detectForVideo(videoRef.current, performance.now());
        } catch (err) {
          console.error("MediaPipe prediction error:", err);
          requestRef = requestAnimationFrame(predictWebcam);
          return;
        }

        if (results && results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const shapes = results.faceBlendshapes[0].categories;
          
          let browDown = 0;
          let eyeWidened = 0;
          let jawOpen = 0;

          // Extract specific relevant blendshapes
          shapes.forEach(shape => {
            if (shape.categoryName === 'browDownLeft' || shape.categoryName === 'browDownRight') {
               browDown += shape.score; // avg or sum
            }
            if (shape.categoryName === 'eyeWidenedLeft' || shape.categoryName === 'eyeWidenedRight') {
              eyeWidened += shape.score;
            }
            if (shape.categoryName === 'jawOpen') {
              jawOpen = shape.score;
            }
          });

          // Empirical thresholds
          if (jawOpen > 0.3 || eyeWidened > 0.8) {
            setExpression((prev) => prev !== "Panic / Wide Eyes" ? "Panic / Wide Eyes" : prev);
          } else if (browDown > 0.4) {
            setExpression((prev) => prev !== "Frowning / Tense" ? "Frowning / Tense" : prev);
          } else {
            setExpression((prev) => prev !== "Neutral" ? "Neutral" : prev);
          }
        }

        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
           const noseTip = results.faceLandmarks[0][1]; // Approximate nose tip node
           
           pastPositions.current.push(noseTip.y);
           if (pastPositions.current.length > 10) pastPositions.current.shift();

           if (pastPositions.current.length === 10) {
              const maxPoint = Math.max(...pastPositions.current);
              const minPoint = Math.min(...pastPositions.current);
              const delta = maxPoint - minPoint;

              if (delta > 0.05) { // Threshold for erratic physical bounding box movement
                 setMovement((prev) => prev !== "Erratic / Fidgeting" ? "Erratic / Fidgeting" : prev);
              } else if (delta > 0.02) {
                 setMovement((prev) => prev !== "Tense / Minor Movement" ? "Tense / Minor Movement" : prev);
              } else {
                 setMovement((prev) => prev !== "Stable" ? "Stable" : prev);
              }
           }
        }
      }

      requestRef = requestAnimationFrame(predictWebcam);
    }

    setupMediaPipe();

    return () => {
      isActive = false;
      if (requestRef) cancelAnimationFrame(requestRef);
      if (videoRef.current && videoRef.current.srcObject) {
         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
         tracks.forEach(track => track.stop());
      }
      if (faceLandmarker) faceLandmarker.close();
    };
  }, []);

  return { videoRef, expression, movement };
}
