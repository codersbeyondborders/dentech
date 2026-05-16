import { Link } from 'react-router-dom';
import { Activity, ShieldPlus, User, Heart, Brain, Zap, Clock, Smartphone, Settings, CheckCircle, Star, Moon } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background font-sans">

      {/* 1. HERO SECTION (Dark Mode) */}
      <section className="bg-[#0F172A] text-white pt-8 pb-32">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Navbar */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="dentech logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">dentech</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-white hover:text-primary transition-colors py-2">Staff Login</Link>
            <Link to="/register" className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Register Patient
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-6 pt-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Sensory-Adapted Dental Environment
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Sensory care in dentistry <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-sage">made accessible.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            We help dental practices and patients seamlessly navigate neurodivergent care globally through real-time biometric tracking and ambient interventions.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-1">
              Register Patient
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all border border-white/5 backdrop-blur-sm">
              Staff Portal Target
            </Link>
          </div>
        </div>


      </section>

      <div className="bg-background"></div>

      {/* 2. PARTNERS / TRUST BANNER */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-secondary/40 uppercase tracking-widest mb-8">Trusted by leading pediatric and specialized care hubs</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-bold flex items-center gap-2"><Heart className="w-6 h-6" /> CareSpire</span>
            <span className="text-xl font-bold flex items-center gap-2"><Zap className="w-6 h-6" /> Zenith Dental</span>
            <span className="text-xl font-bold flex items-center gap-2"><Brain className="w-6 h-6" /> NeuroHealth</span>
            <span className="text-xl font-bold flex items-center gap-2"><Activity className="w-6 h-6" /> Pulse Clinics</span>
            <span className="text-xl font-bold flex items-center gap-2"><ShieldPlus className="w-6 h-6" /> Apex Dentistry</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Core Features</h2>
            <h3 className="text-4xl font-bold text-secondary tracking-tight">Dentistry reimagined for neurodivergent needs</h3>
            <p className="mt-4 text-secondary/60 text-lg">Trust us to deliver cutting edge innovation, transparency, and personalized interventions designed to help you achieve zero-panic procedures.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Real-Time Biometrics", desc: "Track HRV and GSR in real time to predict and prevent sensory overload before it happens." },
              { icon: Zap, title: "Instant Adaptations", desc: "Automatically dim lights and shift ambient audio the moment spikes in distress are detected." },
              { icon: Smartphone, title: "Patient Portals", desc: "Full feature calm-zone app on tablets that grants patients a sense of immersive relaxation." },
              { icon: Settings, title: "Custom Profiles", desc: "Store sensory triggers and soothing preferences tied directly to individual patient profiles." },
              { icon: Brain, title: "AI-Powered Insights", desc: "AI-driven reports that summarize distress events and suggest better coping mechanisms over time." },
              { icon: ShieldPlus, title: "HIPAA Compliant", desc: "Our entire biometric tracking pipeline utilizes end-to-end encryption to protect medical history." }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-secondary mb-3">{feat.title}</h4>
                <p className="text-secondary/60 line-clamp-3">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ALTERNATING FEATURE SHOWCASES */}
      <section id="how" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 space-y-32">

          {/* Showcase A */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm">Dashboard Overview</span>
              <h2 className="text-4xl font-bold text-secondary tracking-tight leading-tight">
                One command center for <br /> real-time distress alerts
              </h2>
              <p className="text-secondary/60 text-lg">
                Our staff portal ensures that your clinic can track patient biometrics consistently and effectively, reducing anxiety spikes without interrupting your workflow.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Visual alerts via facial micro-expressions.</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Simple to integrate with existing clinic hardware.</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Manage multiple operators and treatment stations.</li>
              </ul>
              <div className="pt-6">
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  Try Staff Portal <Activity className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
              <img src="/hero-dashboard.png" alt="Dashboard Details" className="w-full rounded-[2rem] shadow-2xl border border-gray-100" />
            </div>
          </div>

          {/* Showcase B */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm">Patient Experience</span>
              <h2 className="text-4xl font-bold text-secondary tracking-tight leading-tight">
                A serene calm zone system <br /> easy to start using
              </h2>
              <p className="text-secondary/60 text-lg">
                By presenting a patient with an immersive tablet-based "Calm Zone", anxious patients can lock onto slow pulsing gradients and audio to ground themselves during high-stress procedures.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="bg-background p-4 rounded-xl border border-gray-100">
                  <Moon className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-semibold">Custom colors</p>
                </div>
                <div className="bg-background p-4 rounded-xl border border-gray-100">
                  <Clock className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm font-semibold">Procedure tracker</p>
                </div>
              </div>
              <div className="pt-6">
                <Link to="/patient" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-secondary rounded-full font-medium hover:border-primary transition-colors">
                  Try Calm Zone <User className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-secondary/5 rounded-[3rem] transform -rotate-3 scale-105 -z-10"></div>
              <img src="/patient-calm.png" alt="Calm Zone Interface" className="w-full rounded-[2rem] shadow-2xl border border-gray-100" />
            </div>
          </div>

        </div>
      </section>

      {/* 5. STATISTICS RIBBON */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-secondary mb-2 flex items-center justify-center gap-1">234<span className="text-xl">M</span></p>
              <p className="text-sm text-secondary/60 font-medium">Supporting multiple neuro-types & profiles</p>
            </div>
            <div className="text-center relative md:before:absolute md:before:content-[''] md:before:w-px md:before:h-12 md:before:bg-gray-200 md:before:-left-4 md:before:top-1/2 md:before:-translate-y-1/2">
              <div className="bg-primary/10 rounded-2xl p-6 -my-4 transform scale-110">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-1">768<span className="text-xl">K</span></p>
                <p className="text-sm text-primary font-medium">Anxiety events avoided <br /> every month</p>
              </div>
            </div>
            <div className="text-center relative md:before:absolute md:before:content-[''] md:before:w-px md:before:h-12 md:before:bg-gray-200 md:before:-left-4 md:before:top-1/2 md:before:-translate-y-1/2">
              <p className="text-4xl md:text-5xl font-bold text-secondary mb-2 flex items-center justify-center gap-1">5.0<Star className="w-6 h-6 text-accent-amber fill-accent-amber" /></p>
              <p className="text-sm text-secondary/60 font-medium">Ratings from pediatricians & dentists</p>
            </div>
            <div className="text-center relative md:before:absolute md:before:content-[''] md:before:w-px md:before:h-12 md:before:bg-gray-200 md:before:-left-4 md:before:top-1/2 md:before:-translate-y-1/2">
              <p className="text-4xl md:text-5xl font-bold text-secondary mb-2 flex items-center justify-center gap-1">$8.8<span className="text-xl">B</span></p>
              <p className="text-sm text-secondary/60 font-medium">Saved via avoiding abandoned procedures</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING (Dark Theme) */}
      <section id="pricing" className="py-24 bg-[#0F172A] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Pricing</h2>
            <h3 className="text-4xl font-bold tracking-tight">Select a plan that will empower your practice growth</h3>
            <p className="mt-4 text-white/60 text-lg">dentech includes personalized dashboards and biometrics to guarantee satisfaction.</p>
            <div className="inline-flex mt-8 bg-white/5 p-1 rounded-full border border-white/10">
              <button className="px-6 py-2 bg-primary text-white rounded-full font-medium text-sm">Monthly</button>
              <button className="px-6 py-2 text-white/60 hover:text-white rounded-full font-medium text-sm transition-colors">Yearly</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-[#1E293B] rounded-3xl p-8 border border-white/5 hover:border-primary/50 transition-colors">
              <h4 className="text-xl font-bold mb-2">Starter Plan</h4>
              <p className="text-sm text-white/50 mb-6 h-10">Perfect for single practitioner clinics starting out.</p>
              <div className="mb-6"><span className="text-5xl font-bold">$0</span> <span className="text-white/40">/ per month</span></div>
              <ul className="space-y-4 mb-8 text-sm text-white/80">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> 1 Registration Kiosk</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Manual Dashboard</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Standard Alert System</li>
                <li className="flex items-center gap-3 opacity-50"><CheckCircle className="w-5 h-5" /> No Hardware Integrations</li>
              </ul>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors">Select This Plan</button>
            </div>

            {/* Growth */}
            <div className="bg-[#1E293B] rounded-3xl p-8 border-2 border-primary relative transform md:-translate-y-4 shadow-2xl shadow-primary/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h4 className="text-xl font-bold mb-2">Growth Plan</h4>
              <p className="text-sm text-white/50 mb-6 h-10">Ideal for growing practices and small specialized centers.</p>
              <div className="mb-6"><span className="text-5xl font-bold">$49</span> <span className="text-white/40">/ per month</span></div>
              <ul className="space-y-4 mb-8 text-sm text-white/80">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Everything in Starter</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Automated Patient Tools</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Customizable Dashboards</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Full Biometric Tracking</li>
              </ul>
              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-primary/30">Select This Plan</button>
            </div>

            {/* Business */}
            <div className="bg-[#1E293B] rounded-3xl p-8 border border-white/5 hover:border-primary/50 transition-colors">
              <h4 className="text-xl font-bold mb-2">Business Plan</h4>
              <p className="text-sm text-white/50 mb-6 h-10">Perfect for larger organizations and expansive clinics.</p>
              <div className="mb-6"><span className="text-5xl font-bold">$99</span> <span className="text-white/40">/ per month</span></div>
              <ul className="space-y-4 mb-8 text-sm text-white/80">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Everything in Growth</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Hardware Renting</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> Enterprise Security</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent-sage" /> 24/7 AI Support</li>
              </ul>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors">Select This Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Testimonials</h2>
            <h3 className="text-4xl font-bold text-secondary tracking-tight">Real Feedback from Satisfied Customers</h3>
            <p className="mt-4 text-secondary/60 text-lg">Discover what our clients have to say about how our services have helped their clinical goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-400 font-bold">SM</div>
                <div>
                  <h4 className="font-semibold text-secondary">Sarah Mitchell</h4>
                  <p className="text-xs text-secondary/50">Pediatric Dentist</p>
                </div>
              </div>
              <p className="text-secondary/70 text-sm mb-4">"dentech completely changed how I manage procedures. Biometric alerts give me an instant sense of the patient's state before they panic."</p>
              <div className="flex gap-1 text-accent-amber">
                <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" />
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-400 font-bold">JA</div>
                <div>
                  <h4 className="font-semibold text-secondary">Josh Anderson</h4>
                  <p className="text-xs text-secondary/50">Parent</p>
                </div>
              </div>
              <p className="text-secondary/70 text-sm mb-4">"I love the tablet module they lock onto. Coming to the dentist is never a breeze but it's finally manageable for my son."</p>
              <div className="flex gap-1 text-accent-amber">
                <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" />
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-400 font-bold">ER</div>
                <div>
                  <h4 className="font-semibold text-secondary">Elena Reyes</h4>
                  <p className="text-xs text-secondary/50">Clinic Administrator</p>
                </div>
              </div>
              <p className="text-secondary/70 text-sm mb-4">"The easy setup and the seamless dashboard UI means our clinical staff were trained within minutes. An absolutely vital modern tool."</p>
              <div className="flex gap-1 text-accent-amber">
                <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-12 bg-background pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5 shadow-2xl">
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-accent-sage/20 mix-blend-screen blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex justify-center gap-1 text-accent-amber mb-6">
                <Star className="w-6 h-6 fill-current" /> <Star className="w-6 h-6 fill-current" /> <Star className="w-6 h-6 fill-current" /> <Star className="w-6 h-6 fill-current" /> <Star className="w-6 h-6 fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Empowering Your Clinical Impact</h2>
              <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
                Trust us to deliver cutting-edge innovation, transparency, and personalized interventions designed to help you achieve seamless dental procedures.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 transform hover:scale-105">
                Get Started Free <Activity className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#0F172A] text-white pt-16 pb-8 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="dentech logo" className="w-6 h-6 object-contain" />
                <span className="text-xl font-bold tracking-tight">dentech</span>
              </div>
              <p className="text-white/50 text-sm max-w-sm mb-6">
                Empowering inclusive dentistry and elevating patient care every step of the way.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Staff Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Patient</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                <li><Link to="/patient" className="hover:text-primary transition-colors">Enter Calm Zone</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">How to Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2026 dentech. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
