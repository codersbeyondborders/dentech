import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDemoSync } from '../hooks/useDemoSync';
import { useBiometrics } from '../contexts/BiometricsContext';
import { getApiBaseUrl } from '../utils/apiConfig';
import { Sparkles, Moon, Volume2, Wifi, Heart, Wind } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(args));
}

const getCopy = (age: number, lang: string) => {
  const isKid = age <= 12;
  const isHindi = lang?.trim().toLowerCase() === 'hindi';
  const isSpanish = lang?.trim().toLowerCase() === 'spanish';

  if (isKid && isHindi) {
    return {
      inhalePhase: "साँस अंदर",
      holdPhase: "रुकें",
      exhalePhase: "साँस छोड़ें",
      extremeTitle: "एक लंबी साँस लें",
      extremeInhale: "धीरे-धीरे साँस अंदर लें... (Breathe in slowly)",
      extremeHold: "साँस रोक कर रखें... (Hold...)",
      extremeExhale: "आराम से साँस छोड़ें... (Exhale to relax)",
      mediumTitle: "यहाँ ध्यान दें",
      mediumSubtitle: "सर्कल के साथ साँस लें. अंदर... बाहर...",
      normalTitle: "जादू शुरू हो रहा है!",
      normalSubtitle: "आप बहुत बहादुर हैं! रंगों को देखें।",
      footerProgress: "प्रक्रिया की प्रगति",
      footerStep: "चरण 2: दांत भरना",
      footerPaused: "रुका हुआ है",
      footerMetrics: "महत्वपूर्ण संकेतक"
    }
  } else if (isKid) {
    return {
      inhalePhase: "Inhale",
      holdPhase: "Hold",
      exhalePhase: "Exhale",
      extremeTitle: "Let's take a big breath",
      extremeInhale: "Breathe in slowly like a balloon...",
      extremeHold: "Hold it...",
      extremeExhale: "Let it out slowly...",
      mediumTitle: "Look at the circle",
      mediumSubtitle: "Breathe with the circle. In... and out...",
      normalTitle: "The magic is starting!",
      normalSubtitle: "You are doing great! Watch the pretty colors.",
      footerProgress: "Adventure Progress",
      footerStep: "Step 2: Fighting Sugar Bugs",
      footerPaused: "Taking a break",
      footerMetrics: "Superpowers Level"
    }
  } else if (isSpanish) {
    return {
      inhalePhase: "Inhalar",
      holdPhase: "Sostener",
      exhalePhase: "Exhalar",
      extremeTitle: "Tome una respiración profunda",
      extremeInhale: "Respire lentamente...",
      extremeHold: "Sostenga...",
      extremeExhale: "Exhale para relajarse...",
      mediumTitle: "Concéntrese aquí",
      mediumSubtitle: "Haga coincidir su respiración con el círculo. Inhale... y exhale...",
      normalTitle: "Respire profundamente...",
      normalSubtitle: "Lo está haciendo muy bien. Relájese y concéntrese en los colores.",
      footerProgress: "Progreso del procedimiento",
      footerStep: "Paso 2: Fase de llenado",
      footerPaused: "En pausa",
      footerMetrics: "Signos vitales"
    }
  } else if (isHindi) {
    return {
      inhalePhase: "साँस अंदर",
      holdPhase: "रुकें",
      exhalePhase: "साँस बाहर",
      extremeTitle: "गहरी साँस लें",
      extremeInhale: "धीरे-धीरे साँस अंदर लें...",
      extremeHold: "रुकें...",
      extremeExhale: "साँस छोड़ें और आराम करें...",
      mediumTitle: "यहाँ ध्यान दें",
      mediumSubtitle: "अपनी साँसों को इस घेरे के साथ मिलाएं। साँस अंदर... साँस बाहर...",
      normalTitle: "गहरी साँस लें...",
      normalSubtitle: "आप बहुत अच्छा कर रहे हैं। आराम करें और रंगों पर ध्यान दें।",
      footerProgress: "प्रक्रिया की प्रगति",
      footerStep: "चरण 2: दांत भरना",
      footerPaused: "रुका हुआ है",
      footerMetrics: "महत्वपूर्ण संकेतक"
    }
  }

  // Default English Adult
  return {
      inhalePhase: "Inhale",
      holdPhase: "Hold",
      exhalePhase: "Exhale",
      extremeTitle: "Take a Deep Breath",
      extremeInhale: "Breathe in slowly...",
      extremeHold: "Hold...",
      extremeExhale: "Exhale to relax...",
      mediumTitle: "Focus Here",
      mediumSubtitle: "Match your breathing to the expanding circle. Inhale... Exhale...",
      normalTitle: "Breathe In...",
      normalSubtitle: "You're doing great. We are taking care of everything. Let the colors guide your breath.",
  }
}

export default function PatientView() {
  const [currentCase, setSharedCase] = useDemoSync();
  const { metrics } = useBiometrics();

  const [progress, setProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [patientProfile, setPatientProfile] = useState<any>(null);
  
  const hubIp = localStorage.getItem('dentech_hub_ip');
  const isRemote = !!hubIp;

  useEffect(() => {
    // Simulate procedure progression
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100 || currentCase === 'extreme') {
          clearInterval(interval);
          return p;
        }
        return p + 0.5;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentCase]);

  // Listen for Gemma AI function calls to auto-trigger interventions
  useEffect(() => {
    let lastInterventionStr = '';
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/state`);
        if (res.ok) {
          const data = await res.json();
          if (data.patient_profile) {
            setPatientProfile(data.patient_profile);
          }
          const currentInterventionStr = JSON.stringify(data.last_intervention || []);
          if (data.last_intervention && currentInterventionStr !== lastInterventionStr) {
            lastInterventionStr = currentInterventionStr;
            data.last_intervention.forEach((action: any) => {
              const name = typeof action === 'string' ? action : action.name;
              const args = typeof action === 'string' ? {} : action.arguments;
              
              if (name === 'triggerBreathingExercise' && args?.intensity === 'extreme') {
                setSharedCase('extreme');
              } else if (name === 'changeAmbientLighting') {
                // E.g., could apply the color dynamically to the root background
              }
            });
          }
        }
      } catch (err) {
        // Silently ignore polling errors
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Run once — setSharedCase is stable


  // Breathing cycle logic for extreme distress
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (currentCase === 'extreme' || metrics.hr > 115 || metrics.expression === 'Panic / Wide Eyes' || metrics.movement === 'Erratic / Fidgeting') {
      if (breathPhase === 'inhale') {
        timeout = setTimeout(() => setBreathPhase('hold'), 4000);
      } else if (breathPhase === 'hold') {
        timeout = setTimeout(() => setBreathPhase('exhale'), 3000);
      } else if (breathPhase === 'exhale') {
        timeout = setTimeout(() => setBreathPhase('inhale'), 4000);
      }
    }
    return () => clearTimeout(timeout);
  }, [currentCase, breathPhase, metrics]);

  // Adjust visuals based on the case, LIVE CV metrics, or HR measurements
  const hrIsExtreme = metrics.hr > 115;
  const hrIsMedium = metrics.hr > 90;

  const cvIsExtreme = metrics.expression === 'Panic / Wide Eyes' || metrics.movement === 'Erratic / Fidgeting' || hrIsExtreme;
  const cvIsMedium = metrics.expression === 'Frowning / Tense' || metrics.movement === 'Tense / Minor Movement' || hrIsMedium;

  const isExtreme = currentCase === 'extreme' || cvIsExtreme;
  const isMedium = (!isExtreme && currentCase === 'medium') || (!isExtreme && cvIsMedium);

  const age = patientProfile?.age ? parseInt(patientProfile.age) : 30;
  const lang = patientProfile?.language || 'English';
  const copy = getCopy(age, lang);

  // DEBUG LOGGING
  // console.log("Profile:", patientProfile, "Age:", age, "Lang:", lang);

  // Bio-responsive background pulsing based on Heart Rate
  // e.g. HR=60 -> 4s pulse, HR=120 -> 2s pulse
  const pulseDuration = isExtreme ? (breathPhase === 'inhale' || breathPhase === 'exhale' ? '4s' : '3s') : `${Math.max(1, 240 / metrics.hr).toFixed(1)}s`;

  return (
    <div className={cx("min-h-screen relative overflow-hidden flex flex-col justify-between transition-colors duration-1000",
      isExtreme ? 'bg-[#050B14]' : 'bg-secondary'
    )}>
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 z-0">
        <div 
          style={{ animationDuration: pulseDuration }}
          className={cx("absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 animate-[pulse_4s_ease-in-out_infinite]",
            isExtreme ? (breathPhase === 'inhale' ? 'bg-blue-600/50 scale-125' : breathPhase === 'hold' ? 'bg-indigo-600/50 scale-125' : 'bg-blue-900/40 scale-100') :
            isMedium ? 'bg-primary/30' :
            'bg-primary/20'
        )}></div>
        
        <div 
          style={{ animationDuration: pulseDuration }}
          className={cx("absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] mix-blend-screen transition-all duration-1000 animate-[pulse_5s_ease-in-out_infinite_1s]",
            isExtreme ? (breathPhase === 'inhale' ? 'bg-cyan-600/40 scale-125' : breathPhase === 'hold' ? 'bg-blue-500/40 scale-125' : 'bg-indigo-900/30 scale-100') :
            isMedium ? 'bg-indigo-500/40' :
            'bg-indigo-500/20'
        )}></div>

        {!isExtreme && (
          <div 
            style={{ animationDuration: `${parseFloat(pulseDuration) * 3}s` }}
            className={cx("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[100px] mix-blend-screen animate-[spin_15s_linear_infinite]",
              isMedium ? 'bg-accent-amber/10' :
              'bg-accent-sage/10'
          )}></div>
        )}
      </div>

      <header className="relative z-10 p-8 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
        <Link to="/" className="text-white/40 hover:text-white/80 transition-colors">Exit Calm Zone</Link>
        
        {isRemote && (
          <div className="flex items-center gap-2 text-white/60 text-sm bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 shadow-sm ml-4 absolute left-1/4">
            <Wifi className="w-4 h-4 text-green-400" />
            <span>Hub: {hubIp}</span>
          </div>
        )}

        <div className="absolute left-4 top-4 text-xs text-white/30 font-mono">
          Profile Sync: {patientProfile ? `${patientProfile.language} (${patientProfile.age})` : 'Waiting for Hub...'}
        </div>

        {/* Demo Controller buttons */}
        <div className="flex gap-2 mx-auto bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
          <button onClick={() => setSharedCase('normal')} className={cx("px-3 py-1 rounded-full text-xs font-medium transition-colors", currentCase === 'normal' ? 'bg-white text-secondary' : 'text-white/70 hover:bg-white/20')}>Normal</button>
          <button onClick={() => setSharedCase('medium')} className={cx("px-3 py-1 rounded-full text-xs font-medium transition-colors", currentCase === 'medium' ? 'bg-white text-secondary' : 'text-white/70 hover:bg-white/20')}>Medium</button>
          <button onClick={() => setSharedCase('extreme')} className={cx("px-3 py-1 rounded-full text-xs font-medium transition-colors", currentCase === 'extreme' ? 'bg-white text-secondary' : 'text-white/70 hover:bg-white/20')}>Extreme</button>
        </div>

        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
         {isExtreme ? (
           <div className="animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">
             <div className={cx("w-48 h-48 rounded-full border-4 mx-auto flex items-center justify-center mb-8 relative transition-all ease-in-out",
                 breathPhase === 'inhale' ? 'scale-150 border-blue-400/80 bg-blue-500/20 duration-[4000ms]' :
                 breathPhase === 'hold' ? 'scale-150 border-indigo-400/80 bg-indigo-500/40 duration-[3000ms]' :
                 'scale-100 border-white/20 bg-transparent duration-[4000ms]'
             )}>
                 <span className="text-white text-xl md:text-2xl font-light uppercase tracking-widest text-center px-4">
                    {breathPhase === 'inhale' ? copy.inhalePhase : breathPhase === 'hold' ? copy.holdPhase : copy.exhalePhase}
                 </span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide">{copy.extremeTitle}</h1>
             <p className="text-xl md:text-2xl text-blue-200/70 max-w-lg mx-auto font-light leading-relaxed transition-opacity duration-1000">
               {breathPhase === 'inhale' && copy.extremeInhale}
               {breathPhase === 'hold' && copy.extremeHold}
               {breathPhase === 'exhale' && copy.extremeExhale}
             </p>
           </div>
         ) : isMedium ? (
           <div className="animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 rounded-full border-4 border-white/20 mx-auto flex items-center justify-center mb-8 relative">
                <div style={{ animationDuration: pulseDuration }} className="absolute inset-0 border-4 border-white rounded-full animate-[ping_3s_infinite]"></div>
             </div>
             <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-wide">{copy.mediumTitle}</h1>
             <p className="text-xl md:text-2xl text-white/70 max-w-lg mx-auto font-light leading-relaxed">
               {copy.mediumSubtitle}
             </p>
           </div>
         ) : (
           <div className="animate-in fade-in duration-1000">
             <Sparkles style={{ animationDuration: pulseDuration }} className="w-16 h-16 text-primary mb-8 mx-auto animate-[bounce_4s_infinite]" />
             <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-wide">{copy.normalTitle}</h1>
             <p className="text-xl md:text-2xl text-white/50 max-w-lg mx-auto font-light leading-relaxed">
               {copy.normalSubtitle}
             </p>
           </div>
         )}
      </main>

      <footer className={cx("relative z-10 p-8 md:p-16 max-w-4xl w-full mx-auto transition-opacity duration-1000", isExtreme ? 'opacity-30' : 'opacity-100')}>
         <div className="flex justify-between items-end mb-4">
            <div>
               <p className="text-white/80 font-medium mb-1">{copy.footerProgress}</p>
               <p className="text-sm text-white/40">{isExtreme ? copy.footerPaused : copy.footerStep}</p>
            </div>
            <div className="flex items-end gap-6 text-right">
               <div>
                 <p className="text-white/80 font-medium mb-1">{copy.footerMetrics}</p>
                 <div className="flex items-center justify-end gap-4 text-sm text-white/50">
                    <span className={cx("flex items-center gap-1 transition-colors duration-500", 
                        metrics.hr > 85 ? "text-rose-400 font-medium" : "")}>
                       <Heart className={cx("w-4 h-4", metrics.hr > 85 ? "animate-pulse" : "")} /> 
                       {metrics.hr} BPM
                    </span>
                    <span className="flex items-center gap-1">
                       <Wind className="w-4 h-4" /> {metrics.skinTemp}°F
                    </span>
                 </div>
               </div>
               <p className="text-2xl font-light text-white">{Math.floor(progress)}%</p>
            </div>
         </div>
         <div className="h-4 bg-white/10 backdrop-blur rounded-full overflow-hidden border border-white/5">
            <div 
              className={cx("h-full rounded-full transition-all duration-1000 ease-out", isExtreme ? 'bg-blue-900/50' : 'bg-gradient-to-r from-primary to-accent-sage')}
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxzcGF0aCBkPSJNMCAwbDJ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]"></div>
            </div>
         </div>
      </footer>
    </div>
  );
}
