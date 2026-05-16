import { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle, AlertCircle, Webcam, CheckCircle2, Bluetooth, BluetoothConnected, Loader2, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoSync } from '../hooks/useDemoSync';
import { useBiometrics } from '../contexts/BiometricsContext';
import { useComputerVision } from '../hooks/useComputerVision';
import { useGemmaAnalysis } from '../hooks/useGemmaAnalysis';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(args));
}

const PATIENT_PROFILES = [
  { id: '1', name: 'John Doe', procedure: 'Routine Cleaning', history: 'No significant medical history. Normal resting heart rate.' },
  { id: '2', name: 'Jane Smith', procedure: 'Root Canal', history: 'History of severe dental trauma. High anxiety. Currently taking Beta-blockers (lowers resting HR artificially, so HR > 85 is highly elevated for her).' },
  { id: '3', name: 'Bob Jones', procedure: 'Cavity Filling', history: 'Asthmatic. Prone to panic attacks. Needs careful monitoring of breathing rate.' }
];

export default function DentistDashboard() {
  const [currentCase, setSharedCase] = useDemoSync();
  const [patientId, setPatientId] = useState('1');
  const activeProfile = PATIENT_PROFILES.find(p => p.id === patientId) || PATIENT_PROFILES[0];

  const { metrics, historicalData: data, setCVOverrides, btDevice, btIsConnecting, connectWearable, disconnectWearable } = useBiometrics();
  const { videoRef, expression, movement } = useComputerVision();
  const { analysis, streamingText, isAnalyzing, error } = useGemmaAnalysis(videoRef, activeProfile.history);

  useEffect(() => {
    // Pipe live CV states back into the global biometrics engine
    if (expression || movement) {
      setCVOverrides(expression, movement);
    }
  }, [expression, movement, setCVOverrides]);

  const hrIsExtreme = metrics.hr > 115;
  const hrIsMedium = metrics.hr > 90;

  const cvIsExtreme = metrics.expression === 'Panic / Wide Eyes' || metrics.movement === 'Erratic / Fidgeting' || hrIsExtreme;
  const cvIsMedium = metrics.expression === 'Frowning / Tense' || metrics.movement === 'Tense / Minor Movement' || hrIsMedium;

  const isExtreme = currentCase === 'extreme' || cvIsExtreme;
  const isMedium = (!isExtreme && currentCase === 'medium') || (!isExtreme && cvIsMedium);

  const stressLevel = isExtreme ? 'high' : isMedium ? 'medium' : 'low';

  const gaugeColor = stressLevel === 'low' ? 'text-accent-sage bg-accent-sage/10 border-accent-sage' :
                     stressLevel === 'medium' ? 'text-accent-amber bg-accent-amber/10 border-accent-amber' :
                     'text-red-500 bg-red-500/10 border-red-500';

  const StatusIcon = stressLevel === 'low' ? CheckCircle2 :
                     stressLevel === 'medium' ? AlertCircle :
                     AlertTriangle;

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">Command Center</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-secondary/60">Monitoring:</span>
            <select 
              value={patientId} 
              onChange={e => setPatientId(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-secondary rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              {PATIENT_PROFILES.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.procedure}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border border-gray-100">
          <button 
            onClick={() => setSharedCase('normal')}
            className={cx("px-4 py-2 rounded-full text-sm font-medium transition-colors", currentCase === 'normal' ? 'bg-primary text-white' : 'text-secondary/70 hover:bg-gray-100')}
          >
            Normal Case
          </button>
          <button 
            onClick={() => setSharedCase('medium')}
            className={cx("px-4 py-2 rounded-full text-sm font-medium transition-colors", currentCase === 'medium' ? 'bg-accent-amber text-white' : 'text-secondary/70 hover:bg-gray-100')}
          >
            Medium Case
          </button>
          <button 
             onClick={() => setSharedCase('extreme')}
            className={cx("px-4 py-2 rounded-full text-sm font-medium transition-colors", currentCase === 'extreme' ? 'bg-red-500 text-white' : 'text-secondary/70 hover:bg-gray-100')}
          >
            Extreme Case
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {btDevice ? (
            <button 
               onClick={disconnectWearable}
               className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
            >
              <BluetoothConnected className="w-4 h-4" />
              Wearable Linked
            </button>
          ) : (
             <button 
               onClick={connectWearable}
               disabled={btIsConnecting}
               className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50"
             >
                {btIsConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
                {btIsConnecting ? 'Pairing...' : 'Connect Wearable'}
             </button>
          )}

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <Link to="/" className="text-primary hover:underline px-4 text-sm font-medium">Exit</Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Feed */}
          <div className={cx("bg-white rounded-2xl p-4 shadow-sm border relative overflow-hidden flex flex-col h-[400px] transition-colors duration-500", 
            isExtreme ? 'border-red-200' : 'border-gray-100')}>
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2 text-secondary"><Webcam className="w-5 h-5" /> Live Camera Feed</h2>
                <div className="flex gap-2 items-center">
                  <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-sm font-medium text-secondary/60">REC</span>
                </div>
             </div>
             <div className="flex-1 bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden group">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cx("absolute inset-0 w-full h-full object-cover transition-all duration-500", 
                    isExtreme ? 'opacity-70 grayscale' : 'opacity-80'
                  )}
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
                   <div className={cx("backdrop-blur px-3 py-1.5 rounded-lg text-white/90 text-sm transition-colors",
                     isExtreme ? 'bg-red-500/80' : isMedium ? 'bg-accent-amber/80' : 'bg-black/50'
                   )}>
                      Distress Cues: {metrics.expression}
                   </div>
                   <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-lg text-white/90 text-sm flex gap-2">
                       <span>Posture: {metrics.movement}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Retro Vitals Monitor */}
          <div className={cx("rounded-xl p-6 font-mono shadow-sm border flex flex-col md:flex-row gap-6 transition-colors duration-500", 
            isExtreme ? 'bg-[#0A0505] text-red-500 border-red-500/30' : 
            isMedium ? 'bg-[#0A0805] text-amber-500 border-amber-500/30' : 
            'bg-[#050A0A] text-teal-400 border-teal-500/30'
          )}>
             {/* Charts Column */}
             <div className="flex-1 space-y-4">
                {/* Heart Rate */}
                <div className="h-40 border-b border-current/20 pb-2">
                   <div className="flex justify-between text-xs mb-1 uppercase opacity-80">
                      <span>♥ Heart Rate - PPG PLETH</span>
                      <span>HR: {metrics.hr} bpm</span>
                   </div>
                   <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={data}>
                         <YAxis domain={['auto', 'auto']} hide/>
                         <Line type="step" dataKey="hr" stroke="currentColor" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
                
                {/* Skin Temperature */}
                <div className="h-40">
                   <div className="flex justify-between text-xs mb-1 uppercase opacity-80">
                      <span>■ Skin Temperature</span>
                      <span>TEMP: {metrics.skinTemp} °F</span>
                   </div>
                   <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={data}>
                         <YAxis domain={['auto', 'auto']} hide/>
                         <Line type="monotone" dataKey="skinTemp" stroke="currentColor" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Numeric Summaries Column */}
             <div className="w-48 flex flex-col justify-between border-l border-current/20 pl-6 uppercase text-center space-y-4">
               <div>
                 <p className="text-[10px] opacity-70 tracking-widest text-[#5c5c8a]">HEART RATE</p>
                 <p className="text-5xl font-bold my-1 text-current tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                   {metrics.hr}
                 </p>
                 <p className="text-[10px] opacity-70 tracking-widest">BPM<br/>NORMAL: 60-100</p>
               </div>
               
               <div className="border-t border-current/20 pt-4">
                 <p className="text-[10px] opacity-70 tracking-widest text-[#8a5c5c]">SKIN TEMP</p>
                 <p className="text-5xl font-bold my-1 text-current tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                   {metrics.skinTemp}
                 </p>
                 <p className="text-[10px] opacity-70 tracking-widest">°F<br/>NORMAL: 98.6</p>
               </div>
               
               <div className="border-t border-current/20 pt-4">
                 <p className="text-[10px] opacity-70 tracking-widest text-[#8a5c5c]">FACIAL EXP</p>
                 <p className="text-2xl font-bold my-1 text-current tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] whitespace-normal capitalize">
                   {metrics.expression}
                 </p>
               </div>
               
               <div className="border-t border-current/20 pt-4">
                 <p className="text-[10px] opacity-70 tracking-widest text-[#5c8a5c]">MOVEMENT</p>
                 <p className="text-2xl font-bold my-1 text-current tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] whitespace-normal capitalize">
                   {metrics.movement}
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Status Column */}
        <div className="space-y-6">
          <div className={cx("rounded-2xl p-8 shadow-sm border flex flex-col items-center justify-center text-center transition-all duration-500", 
            isExtreme ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100')}>
            <h2 className="text-lg font-semibold text-secondary/60 uppercase tracking-widest mb-6">Current Stress Level</h2>
            
            <div className={cx("w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6", gaugeColor)}>
              <StatusIcon className={cx("w-12 h-12", gaugeColor.split(' ')[0])} />
            </div>

            <p className={cx("text-3xl font-bold capitalize mb-2", isExtreme ? 'text-red-600' : 'text-secondary')}>{stressLevel}</p>
            <p className="text-secondary/70">
              {stressLevel === 'low' && "Patient is calm and comfortable."}
              {stressLevel === 'medium' && "Mild anxiety detected. Consider pausing."}
              {stressLevel === 'high' && "High distress! Recommend immediate break."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-secondary">Intervention Tools</h3>
            <div className="space-y-3">
              <button 
                onClick={() => isExtreme ? setSharedCase('normal') : setSharedCase('extreme')}
                className={cx("w-full py-3 px-4 rounded-xl font-medium transition-colors flex justify-between items-center group",
                  isExtreme ? 'bg-red-500 text-white hover:bg-red-600 animate-[pulse_2s_infinite]' : 'bg-primary/10 text-primary hover:bg-primary/20'
              )}>
                {isExtreme ? 'FORCE HALT PROCEDURE (RESET)' : 'Trigger Deep Breathing Visuals'}
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors flex justify-between items-center group">
                {isMedium ? 'Dim Dental Light (Recommended)' : 'Dim Dental Light'}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors flex justify-between items-center group">
                Play Ambient Audio Track
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </div>
          </div>

          {/* AI Transparency Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-secondary flex items-center gap-2">
                  <Brain className={cx("w-5 h-5", isAnalyzing ? "text-purple-500 animate-pulse" : "text-gray-400")} /> 
                  Gemma 4 Analysis
                </h3>
                {isAnalyzing && <span className="text-xs text-purple-500 font-medium bg-purple-50 px-2 py-1 rounded-full">Reasoning...</span>}
             </div>
             
             {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
             
             {/* Streaming typewriter: shows while Gemma is thinking */}
             {isAnalyzing && streamingText && (
               <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                 <p className="font-medium text-purple-900 mb-1">Clinical Reasoning:</p>
                 <p className="text-purple-800/80 leading-relaxed text-sm">
                   {streamingText}
                   <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-[blink_1s_step-end_infinite]" />
                 </p>
               </div>
             )}

             {/* Final committed analysis (shown once streaming is done) */}
             {!isAnalyzing && analysis && (
               <div className="space-y-4 text-sm">
                 <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                   <p className="font-medium text-purple-900 mb-1">Clinical Reasoning:</p>
                   <p className="text-purple-800/80 leading-relaxed">{analysis.reasoning}</p>
                 </div>
                 
                 {analysis.function_calls && analysis.function_calls.length > 0 && (
                   <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                     <p className="font-medium text-blue-900 mb-2">Automated Interventions Triggered:</p>
                     <ul className="space-y-2">
                       {analysis.function_calls.map((fc, i) => {
                         const isString = typeof fc === 'string';
                         const name = isString ? fc : fc.name;
                         const args = isString ? null : JSON.stringify(fc.arguments);
                         return (
                         <li key={i} className="flex flex-col gap-1 text-blue-800/80 bg-white p-2 rounded border border-blue-50">
                           <span className="font-mono text-xs">{name}()</span>
                           {args && args !== "{}" && <span className="text-xs opacity-70">{args}</span>}
                         </li>
                         );
                       })}
                     </ul>
                   </div>
                 )}
               </div>
             )}

             {!isAnalyzing && !analysis && !streamingText && (
               <div className="flex-1 flex items-center justify-center text-gray-400 text-sm py-8 text-center">
                 Awaiting initial multimodal assessment...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
