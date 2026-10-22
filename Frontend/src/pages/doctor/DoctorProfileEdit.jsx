import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function DoctorProfileEdit() {
  const { user } = useAuth()
  const doctor = getDoctorByUserId(user?.id)
  const specNames = (doctor?.specializationIds || [])
    .map((id) => SPECIALIZATIONS.find((s) => s.id === id)?.name)
    .filter(Boolean)

  const licenses = doctor?.licensedStates || []

  if (!doctor) return null

  const displayName = doctor.name.replace(/^Dr\\.?\\s*/i, '')

  return (
    <PageShell
      eyebrow="Profile"
      title={displayName ? `Dr. ${displayName}` : 'Your profile'}
      subtitle="This page is read-only for doctors. Admin manages profile edits to keep patient-facing info consistent."
      heroSize="compact"
      contentMax="max-w-2xl"
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <UserRound className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to="/doctor">Back to dashboard</PageBackLink>

      <div className="card p-8 md:p-10 rounded-[2rem]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <UserRound className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-black text-blue-700 uppercase tracking-widest">
                {doctor.qualification || 'Verified professional'}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {doctor.name}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Account details shown for patient context.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.35em]">
              Admin-controlled updates
            </p>
            <p className="text-sm text-slate-600 font-medium mt-2">
              Doctors can view this page only. If something needs updating,
              request changes through the admin workflow.
            </p>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div>
            <p className="section-kicker mb-3">Bio</p>
            <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {doctor.bio || '—'}
            </p>
          </div>
          <div>
            <p className="section-kicker mb-3">Specializations</p>
            {specNames.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium">—</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {specNames.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6">
              <p className="section-kicker mb-3">Licensed states</p>
              <p className="text-sm text-slate-600 font-medium">
                {Array.isArray(licenses) && licenses.length
                  ? licenses.join(', ')
                  : 'Global'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-end gap-3">
          <Link to="/doctor" className="btn-secondary text-sm">
            Back to dashboard
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
