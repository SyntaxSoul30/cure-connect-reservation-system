import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Calendar, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="animate-in fade-in duration-700 bg-[#FBFCFD] theme-emerald">
      <section className="bg-[#047857] text-white py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(255,255,255,0.24),_rgba(255,255,255,0.02)_36%,_transparent_58%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.15),_transparent_36%,_transparent_72%,_rgba(255,255,255,0.12))] pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none hero-orb-float" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[420px] h-[420px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none hero-orb-float-delayed" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#FBFCFD] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="hero-badge">Welcome to smarter care</span>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-8 ring-1 ring-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Trusted care, <br className="hidden md:block" /> one click away.
          </h1>

          <p className="text-emerald-50/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The modern way to find specialists and book appointments <br className="hidden md:block" /> across your clinical network.
          </p>

          {!user ? (
            <Link
              to="/login"
              className="hero-cta group px-14 py-5"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              to={user.role === 'patient' ? '/patient' : user.role === 'admin' ? '/admin' : '/doctor'}
              className="hero-cta group"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-3 block">Official Registry</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center">A simpler path to wellness</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Find Your Expert"
              desc="Access our vetted network of clinical specialists filtered by location and availability."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Instant Scheduling"
              desc="View real-time calendars and secure your slot in seconds with zero hold times."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Unified Hub"
              desc="Manage visits and track your healthcare journey from one secure dashboard."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group text-center">
      <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#047857] group-hover:text-white transition-all duration-500">
        <div className="text-emerald-700 group-hover:text-white transition-colors">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  )
}
