import { Link } from 'react-router-dom';
import { Stethoscope, User, Activity, Wifi, ShieldPlus } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

export default function RoleSelection() {
  const [startingHub, setStartingHub] = useState(false);
  const [hubStatus, setHubStatus] = useState<string | null>(null);

  const startHubAndNavigate = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStartingHub(true);
    setHubStatus('Starting local AI Backend (Gemma 4)...');
    try {
      // Only invoke Tauri commands if we are running inside the Tauri app
      if ('__TAURI_INTERNALS__' in window) {
        await invoke('start_backend');
      } else {
        console.log('Running in browser mode. Assuming backend is started manually.');
      }
      setHubStatus('Backend running. Navigating to Patient Intake...');
      setTimeout(() => {
        window.location.href = '/intake';
      }, 1000);
    } catch (error) {
      console.error('Failed to start backend:', error);
      setHubStatus('Error starting backend. Make sure Python is configured.');
      setStartingHub(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="dentech logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight">dentech</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Select Your Role
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Choose how you are using this device today. Dentech works entirely offline over a local WiFi hotspot.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Hub Option */}
          <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all group flex flex-col h-full shadow-2xl">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Main Hub (Dentist)</h2>
            <p className="text-white/60 mb-6 flex-grow">
              Run this on your main laptop. This mode hosts the Gemma 4 AI engine, manages the local network, and displays the clinical Dentist Dashboard.
            </p>
            
            <div className="space-y-3 mb-8 text-sm text-white/70">
              <div className="flex items-center gap-3"><Activity className="w-4 h-4 text-accent-sage" /> Runs AI Backend locally</div>
              <div className="flex items-center gap-3"><ShieldPlus className="w-4 h-4 text-accent-sage" /> Full HIPAA Compliant Data Storage</div>
              <div className="flex items-center gap-3"><Wifi className="w-4 h-4 text-accent-sage" /> Hosts the local clinical network</div>
            </div>

            <button 
              onClick={startHubAndNavigate}
              disabled={startingHub}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {startingHub ? 'Starting Hub...' : 'Start as Main Hub'}
            </button>
            {hubStatus && (
              <p className="mt-3 text-sm text-center text-accent-sage">{hubStatus}</p>
            )}
          </div>

          {/* Patient Screen Option */}
          <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all group flex flex-col h-full shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Patient Screen</h2>
            <p className="text-white/60 mb-6 flex-grow">
              Run this on a tablet or secondary monitor for the patient. This mode is lightweight, captures biometric data, and connects to the Main Hub.
            </p>

            <div className="space-y-3 mb-8 text-sm text-white/70">
              <div className="flex items-center gap-3"><Activity className="w-4 h-4 text-accent-sage" /> Captures Web Bluetooth Vitals</div>
              <div className="flex items-center gap-3"><ShieldPlus className="w-4 h-4 text-accent-sage" /> Runs edge MediaPipe Vision</div>
              <div className="flex items-center gap-3"><Wifi className="w-4 h-4 text-accent-sage" /> Connects to Hub over WiFi</div>
            </div>

            <Link 
              to="/patient-connect"
              className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              Connect to Hub
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/about" className="text-sm text-white/40 hover:text-white/80 transition-colors underline decoration-white/20 underline-offset-4">
            View Project Information
          </Link>
        </div>
      </div>
    </div>
  );
}
