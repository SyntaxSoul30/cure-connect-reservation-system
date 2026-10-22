import { Link } from 'react-router-dom'
import { Users, Building2, ArrowRight } from 'lucide-react'
import { getDoctors, getFacilities } from '../../services/api'
import PageShell from '../../components/PageShell'

export default function AdminDashboard() {
  const doctors = getDoctors()
  const facilities = getFacilities()

  const statCards = [
    {
      to: '/admin/doctors',
      label: 'Doctors',
      value: doctors.length,
      hint: 'Profiles, specialties, licenses',
      icon: Users,
    },
    {
      to: '/admin/facilities',
      label: 'Facilities',
      value: facilities.length,
      hint: 'Locations, hours, capacity',
      icon: Building2,
    },
  ]

  return (
    <PageShell
      eyebrow="Administration"
      title="Operations dashboard"
      subtitle="Keep providers, facilities, and scheduling data aligned—same calm experience as the public site, tuned for control."
      tone="blue"
      actions={
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/admin/doctors/new"
            className="group inline-flex items-center justify-center gap-2 bg-white text-blue-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-2xl shadow-blue-900/25 hover:bg-blue-50 transition-all hover:-translate-y-0.5"
          >
            Add doctor
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/admin/facilities"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl ring-1 ring-white/25 hover:bg-white/15 transition-all"
          >
            Manage facilities
          </Link>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl">
        {statCards.map(
          ({ to, label, value, hint, icon: Icon, linkLabel }) => (
            <Link
              key={label}
              to={to}
              className="group card-interactive p-8 rounded-[2rem] flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" strokeWidth={2.25} />
              </div>
              <p className="section-kicker text-slate-400 mb-2">{label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                {value}
              </p>
              <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
                {hint}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700 group-hover:gap-3 transition-all">
                {linkLabel || `Open ${label.toLowerCase()}`}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ),
        )}
      </div>
    </PageShell>
  )
}
