import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAppointmentsByPatientId, cancelAppointment } from '../../services/api'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function MyAppointments() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [, setRefresh] = useState(0)
  /** Appointment user is cancelling — modal double-check (no window.confirm). */
  const [cancelModalApt, setCancelModalApt] = useState(null)

  const activeTab = searchParams.get('tab') || 'upcoming'

  const appointments = getAppointmentsByPatientId(user?.id) || []

  const isWithin24Hours = (dateStr, slotTime) => {
    const aptDate = new Date(dateStr + 'T' + (slotTime || '00:00') + ':00')
    const now = new Date()
    const hoursDiff = (aptDate - now) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff < 24
  }

  const cancelModalWithin24 =
    cancelModalApt && isWithin24Hours(cancelModalApt.date, cancelModalApt.slotTime)

  const confirmCancellation = () => {
    if (!cancelModalApt) return
    const late = isWithin24Hours(cancelModalApt.date, cancelModalApt.slotTime)
    cancelAppointment(cancelModalApt.id, { lateCancellation: late })
    setCancelModalApt(null)
    setRefresh((r) => r + 1)
    setSearchParams({ tab: 'history' })
  }

  const getLocalToday = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayStr = getLocalToday()

  /** Future visits that are still active (cancelled slots move to history). */
  const upcoming = appointments
    .filter((a) => a.date >= todayStr && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  /** Past visits plus any cancelled appointment (including future-dated cancellations). */
  const historyRecords = appointments
    .filter((a) => a.date < todayStr || a.status === 'cancelled')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <PageShell
      eyebrow="My care"
      title="Appointment manager"
      subtitle="Review your upcoming schedule and clinical history in one place."
      tone="rose"
      actions={
        <Link
          to="/patient/doctors"
          className="group inline-flex items-center gap-2 bg-white text-rose-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-xl shadow-rose-900/30 hover:bg-rose-50 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          Schedule visit
        </Link>
      }
    >
      <PageBackLink to="/patient">Patient dashboard</PageBackLink>

      <div className="flex gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'upcoming' })}
          className={`px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white text-rose-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'history' })}
          className={`px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-white text-rose-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          History ({historyRecords.length})
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'upcoming' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {upcoming.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center card">
                <p className="text-slate-400 font-medium mb-4">No scheduled visits found.</p>
                <Link
                  to="/patient/doctors"
                  className="inline-flex items-center justify-center bg-rose-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-800 transition-colors"
                >
                  Schedule new visit
                </Link>
              </div>
            ) : (
              <ul className="grid gap-4">
                {upcoming.map((apt) => {
                  const aptDateObj = new Date(apt.date + 'T12:00:00')

                  return (
                    <li
                      key={apt.id}
                      className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-all hover:border-rose-200"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center border bg-rose-50 text-rose-700 border-rose-200">
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {aptDateObj.toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-2xl font-black leading-none">{aptDateObj.getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{apt.doctorName}</h3>
                          <p className="text-sm text-slate-500 font-medium">
                            {apt.slotTime} • {apt.chamberName}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            Fee: ${apt.charge ?? 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-3">
                        {isWithin24Hours(apt.date, apt.slotTime) && (
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-[10px] font-black uppercase">Late cancellation fee applies</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setCancelModalApt(apt)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest bg-red-50/50 px-5 py-2.5 rounded-xl border border-red-100"
                        >
                          Cancel slot
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {historyRecords.length === 0 ? (
              <div className="p-16 text-center text-slate-300 font-bold uppercase tracking-widest opacity-50">
                No history recorded
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                      <th className="px-8 py-5">Visit date</th>
                      <th className="px-8 py-5">Consultant</th>
                      <th className="px-8 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {historyRecords.map((apt) => {
                      const aptDateObj = new Date(apt.date + 'T12:00:00')

                      return (
                        <tr key={apt.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6 text-slate-500 font-bold">
                            {aptDateObj.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-slate-900 font-bold">{apt.doctorName}</p>
                            {apt.actualDurationMinutes && (
                              <p className="text-[10px] text-rose-600 font-black uppercase mt-0.5">
                                {apt.actualDurationMinutes}m session
                              </p>
                            )}
                          </td>
                          <td className="px-8 py-6 align-top">
                            <span
                              className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                apt.status === 'cancelled'
                                  ? 'bg-red-50 text-red-400'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {apt.status}
                            </span>
                            {apt.status === 'cancelled' && apt.cancellationFeeApplied && (
                              <p className="text-[10px] text-slate-500 font-medium mt-2 max-w-[14rem] leading-snug">
                                Late cancellation fee assessed per policy.
                              </p>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {cancelModalApt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => setCancelModalApt(null)}
            aria-label="Dismiss"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 md:p-8 animate-in fade-in zoom-in-95 duration-200"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                cancelModalWithin24 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <h2 id="cancel-dialog-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Cancel this appointment?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {cancelModalWithin24 ? (
                <>
                  You are cancelling within 24 hours of your visit time. Under our policy, a{' '}
                  <strong className="text-slate-800">late cancellation fee</strong> may be charged to
                  your saved payment method. This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to cancel this consultation? You can book a new visit anytime from
                  your dashboard.
                </>
              )}
            </p>
            <p className="mt-3 text-xs font-medium text-slate-400">
              Doctor: {cancelModalApt.doctorName} · {cancelModalApt.slotTime} · {cancelModalApt.chamberName}
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="px-5 py-3 rounded-2xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep appointment
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
                className="px-5 py-3 rounded-2xl bg-red-600 font-bold text-sm text-white shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors"
              >
                Yes, cancel appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
