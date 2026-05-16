import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(args));
}

export default function Registration() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="dentech logo" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-primary tracking-tight">dentech</h1>
        </div>
        <Link to="/" className="text-secondary/60 hover:text-primary transition-colors">Cancel</Link>
      </header>

      <main className="flex-1 flex flex-col items-center max-w-3xl w-full mx-auto">
        <div className="w-full mb-12">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            {['Basic Info', 'Sensory Profile', 'Preferences', 'Complete'].map((label, idx) => (
              <div key={label} className="flex flex-col items-center w-1/4">
                <div className={cx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-medium mb-2 transition-colors duration-300",
                  step > idx + 1 ? "bg-primary text-white" :
                    step === idx + 1 ? "bg-primary text-white ring-4 ring-primary/20" :
                      "bg-gray-200 text-gray-500"
                )}>
                  {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={cx("text-sm font-medium", step >= idx + 1 ? "text-secondary" : "text-gray-400")}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 w-full min-h-[400px] flex flex-col relative overflow-hidden">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold mb-6 text-secondary">Let's start with the basics</h2>
              <p className="text-secondary/60 mb-8">Personalize your dental care by sharing a bit about yourself or your loved one.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Patient's Full Name</label>
                  <input type="text" className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Age</label>
                    <input type="number" className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Diagnosis (Optional)</label>
                    <select className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                      <option>Select...</option>
                      <option>Autism Spectrum</option>
                      <option>ADHD</option>
                      <option>Sensory Processing Disorder</option>
                      <option>Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold mb-6 text-secondary">Sensory Profile</h2>
              <p className="text-secondary/60 mb-8">Select any elements that typically cause distress during a dental visit.</p>

              <div className="grid grid-cols-2 gap-4">
                {['Bright Lights', 'Loud Noises / Drilling', 'Unexpected Touch', 'Strong Tastes', 'Vibration', 'Confinement'].map(trigger => (
                  <label key={trigger} className="p-4 border border-gray-200 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20" />
                    <span className="font-medium text-secondary group-hover:text-primary transition-colors">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold mb-6 text-secondary">Environmental Preferences</h2>
              <p className="text-secondary/60 mb-8">How can we make the Sensory Zone most calming for you?</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Preferred Audio Environment</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Nature Sounds', 'Brown Noise', 'Binaural Beats'].map(audio => (
                      <div key={audio} className="p-4 border border-gray-200 rounded-xl text-center cursor-pointer hover:border-primary hover:bg-primary/5 font-medium text-sm transition-all">
                        {audio}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Preferred Visual Colors</label>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-500 cursor-pointer ring-2 ring-offset-2 ring-teal-500"></div>
                    <div className="w-12 h-12 rounded-full bg-indigo-500 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
                    <div className="w-12 h-12 rounded-full bg-rose-300 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-accent-sage/20 text-accent-sage rounded-full flex items-center justify-center mb-6">
                <Check className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-secondary">Profile Complete!</h2>
              <p className="text-secondary/60 mb-8 max-w-md">
                Your sensory profile has been sent to our clinical team. We look forward to providing a calm, stress-free dental experience.
              </p>
              <Link to="/" className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Return Home
              </Link>
            </div>
          )}

          <div className="mt-auto pt-8 flex justify-between">
            {step > 1 && step < 4 ? (
              <button onClick={prevStep} className="px-6 py-3 rounded-xl font-medium text-secondary/60 hover:text-secondary hover:bg-gray-50 flex items-center gap-2 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}

            {step < 4 && (
              <button onClick={nextStep} className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 ml-auto">
                {step === 3 ? 'Complete Profile' : 'Next Step'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
