import React, { useMemo } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function BookingSuccess() {
  const location = useLocation()

  const apt = location.state?.appointment

  const confirmationNumber = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }, [])

  if (!apt) {
    return <Navigate to="/patient" replace />
  }

  const formatAptDate = (dateStr) => {
    try {
      if (!dateStr) return 'Date TBD'
      const d = new Date(dateStr + 'T12:00:00')
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch (e) {
      return 'Invalid date'
    }
  }

  return (
    <PageShell
      eyebrow="Booking"
      title="Booking confirmed"
      subtitle="Your consultation slot has been successfully reserved."
      tone="rose"
      heroSize="compact"
      contentMax="max-w-2xl"
    >
      <PageBackLink to="/patient">Patient dashboard</PageBackLink>

      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-rose-200/80 mx-auto sm:mx-0">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm ring-1 ring-slate-100 card">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center border-b border-slate-50 pb-4">
          Appointment summary
        </h2>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-2 border border-slate-100/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Confirmation code
            </span>
            <span className="text-sm font-black text-rose-700 tracking-[0.2em]">{confirmationNumber}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-400">Doctor</span>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{apt.doctorName || 'Specialist'}</p>
              <p className="text-[10px] font-bold text-rose-600 uppercase">Verified provider</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Date & time</span>
            <span className="text-sm font-bold text-slate-900">
              {formatAptDate(apt.date)} at {apt.slotTime || 'TBD'}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-400">Location</span>
            <div className="text-right max-w-[200px]">
              <p className="text-sm font-bold text-slate-900">{apt.chamberName || 'Facility'}</p>
              <p className="text-xs text-slate-500 font-medium">
                {apt.chamberCity || ''}, {apt.chamberState || ''}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Consultation fee</span>
            <span className="text-lg font-black text-slate-900">${apt.charge ?? 0}</span>
          </div>

          <div className="pt-4 flex justify-between items-start">
            <span className="text-sm font-medium text-slate-400">Payment method</span>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-end">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                {apt.paymentMethod || 'Secure card'}
              </p>
              <p className="text-[10px] text-rose-600 font-bold uppercase mt-1 tracking-widest">
                Auto-debited post-visit
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
            <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-500">
            Important arrival note
          </h4>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed pl-9">
          Please plan to arrive at least <strong className="text-slate-700">20 minutes before</strong> your
          scheduled appointment time to complete check-in procedures and pre-appointment vitals.
        </p>
      </div>

      <div className="mt-4 p-6 bg-[#0F172A] rounded-3xl text-white w-full shadow-xl shadow-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <h4 className="font-bold text-xs uppercase tracking-widest text-rose-400">Cancellation policy</h4>
        </div>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Notice: Cancellations made within 24 hours of the scheduled time will incur a $50 service fee, which
          will be automatically charged to your saved card.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full">
        <Link
          to="/patient/appointments"
          className="flex-1 bg-rose-700 hover:bg-rose-800 text-white py-4 rounded-2xl font-bold transition-all text-center shadow-lg shadow-rose-900/25"
        >
          Manage appointments
        </Link>
        <Link
          to="/patient"
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all text-center hover:bg-slate-50"
        >
          Go to dashboard
        </Link>
      </div>
    </PageShell>
  )
}
