import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, ArrowRight, ShieldPlus, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientConnect() {
  const [ipAddress, setIpAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipAddress) {
      setError('Please enter a valid IP address');
      return;
    }

    setIsConnecting(true);
    setError(null);

    // Basic validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;
    if (!ipRegex.test(ipAddress) && ipAddress !== 'localhost') {
        // We won't block if it's not a perfect IP, maybe it's a hostname, but give a warning
        console.warn("IP might be malformed");
    }

    // Save to local storage for global use across the app
    localStorage.setItem('dentech_hub_ip', ipAddress);

    // In a real app we'd ping the backend to verify connection here
    // For now we'll simulate a connection delay
    setTimeout(() => {
      setIsConnecting(false);
      navigate('/patient');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-accent-sage/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Role Selection
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-accent-sage" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Connect to Hub</h1>
          </div>
          <p className="text-white/60">
            Enter the Local IP Address displayed on the Dentist's Main Hub machine to sync this device.
          </p>
        </div>

        <form onSubmit={handleConnect} className="bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="mb-6">
            <label htmlFor="ipAddress" className="block text-sm font-medium text-white/70 mb-2">
              Hub IP Address
            </label>
            <input
              type="text"
              id="ipAddress"
              placeholder="e.g., 192.168.137.5"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Clinic Network'}
            {!isConnecting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <ShieldPlus className="w-4 h-4 text-primary" /> Secure Local Connection
          </h3>
          <ul className="space-y-3 text-xs text-white/60">
            <li className="flex items-start gap-2">
              <div className="mt-0.5"><Activity className="w-3 h-3 text-accent-sage" /></div>
              <span>All biometric data processing occurs locally on this device.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5"><Activity className="w-3 h-3 text-accent-sage" /></div>
              <span>No internet connection is required or used.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
