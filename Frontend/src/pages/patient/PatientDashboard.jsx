import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, History } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAppointmentsByPatientId } from '../../services/api'
import PageShell from '../../components/PageShell'
import { greetingFirstNameFromEmail } from '../../utils/displayProfile'

export default function PatientDashboard() {
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName =
    (user?.firstName && String(user.firstName).trim()) ||
    (user?.name && String(user.name).split(' ')[0]) ||
    greetingFirstNameFromEmail(user?.email) ||
    'there'

  const allAppointments = user?.id
    ? getAppointmentsByPatientId(user.id) || []
    : []

  const upcoming = allAppointments
    .filter(
      (a) =>
        a &&
        a.status === 'confirmed' &&
        a.date >= new Date().toISOString().slice(0, 10),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <PageShell
      eyebrow="Patient portal"
      title={`${greeting}, ${firstName}`}
      subtitle="Manage upcoming visits, browse specialists, and keep your care journey organized—in one calm, secure place."
      tone="rose"
      actions={
        <Link
          to="/patient/doctors"
          className="group inline-flex items-center gap-3 bg-white text-rose-700 text-xs font-black uppercase tracking-[0.15em] px-8 py-4 rounded-2xl shadow-2xl shadow-rose-900/30 hover:bg-rose-50 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Schedule visit
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      }
    >
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h2 className="section-kicker mb-5 px-1">Upcoming appointments</h2>

          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border border-rose-100/80 rounded-[1.5rem] p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:shadow-rose-900/[0.06] transition-all duration-300"
                >
                  <p className="text-base font-bold text-slate-900">{apt.doctorName}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {apt.date} at {apt.slotTime} · {apt.chamberName || 'Medical center'}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mt-2">
                    Confirmed consultation
                  </p>
                </div>
              ))}
              <Link
                to="/patient/appointments"
                className="block text-center w-full py-4 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded-2xl font-bold text-rose-600 transition-all border border-rose-100"
              >
                Manage all upcoming appointments
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium mb-6">
                No appointments yet. Find a specialist and book your first visit.
              </p>
              <Link
                to="/patient/doctors"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all"
              >
                Browse specialists
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-8">
          <h2 className="section-kicker mb-5 px-1">Quick access</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              to="/patient/appointments"
              className="group bg-white border border-slate-100 p-8 rounded-[2rem] hover:border-rose-200 transition-all duration-300 shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:shadow-rose-900/[0.06] hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upcoming visits</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Review confirmations, times, and locations in one place.
              </p>
            </Link>

            <Link
              to="/patient/appointments?tab=history"
              className="group bg-white border border-slate-100 p-8 rounded-[2rem] hover:border-rose-200 transition-all duration-300 shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:shadow-rose-900/[0.06] hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Visit history</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Past consultations and statuses at a glance.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
