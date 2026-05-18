import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Activity, ArrowRight, Zap, MapPin, Languages, Calendar } from 'lucide-react';
import clsx from 'clsx';

const PRESETS = [
  { 
    name: 'John Doe', 
    age: '35',
    language: 'English',
    location: 'New York, USA',
    procedure: 'Routine Cleaning', 
    history: 'No significant medical history. Normal resting heart rate.' 
  },
  { 
    name: 'Aarav Patel', 
    age: '8',
    language: 'Hindi',
    location: 'Mumbai, India',
    procedure: 'Cavity Filling', 
    history: 'First time at the dentist. Very anxious. Needs gentle, fun communication.' 
  },
  { 
    name: 'Maria Garcia', 
    age: '72',
    language: 'Spanish',
    location: 'Madrid, Spain',
    procedure: 'Root Canal', 
    history: 'History of severe dental trauma. High anxiety. Currently taking Beta-blockers (lowers resting HR artificially, so HR > 85 is highly elevated for her).' 
  }
];

export default function PatientIntake() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('English');
  const [location, setLocation] = useState('');
  const [procedure, setProcedure] = useState('');
  const [history, setHistory] = useState('');

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setAge(preset.age);
    setLanguage(preset.language);
    setLocation(preset.location);
    setProcedure(preset.procedure);
    setHistory(preset.history);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !procedure || !history || !age || !language) return;

    // Navigate to dashboard and pass the state
    navigate('/dashboard', {
      state: {
        patient: { name, age, language, location, procedure, history }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Patient Intake</h1>
          <p className="text-blue-100 mt-2">Configure the clinical profile for Gemma 4 AI analysis.</p>
        </div>

        <div className="p-8">
          
          {/* Quick Load Presets */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" /> Demo Quick-Load
            </h2>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-1.5 bg-white text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
                >
                  {preset.name} ({preset.procedure})
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-gray-400" /> Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> Age
                </label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. 35"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Languages className="w-4 h-4 text-gray-400" /> Language
                </label>
                <input
                  type="text"
                  required
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Hindi"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Location (Context)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Mumbai, India"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 text-gray-400" /> Procedure
                </label>
                <input
                  type="text"
                  required
                  value={procedure}
                  onChange={e => setProcedure(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Root Canal"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-gray-400" /> Medical History & Notes
              </label>
              <textarea
                required
                value={history}
                onChange={e => setHistory(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                placeholder="Enter medical history, pre-existing conditions, baseline anxiety levels..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This text provides the core context for Gemma 4's RAG-based biometric analysis.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-md",
                  (name && procedure && history) 
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
