import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserCog, ArrowRight } from 'lucide-react'
import { getDoctors, getChambers, getDoctorById, getFacilityById, deleteDoctor, moveChamberToDoctor } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function AdminDoctors() {
  const [refresh, setRefresh] = useState(0)
  const [movingChamberId, setMovingChamberId] = useState(null)
  const [newDoctorId, setNewDoctorId] = useState('')
  const doctors = getDoctors()
  const chambers = getChambers()

  const handleDeleteDoctor = (doctorId, name) => {
    if (!window.confirm(`Delete doctor "${name}"? This will remove all their chambers and cancel their appointments.`)) return
    deleteDoctor(doctorId)
    setRefresh(r => r + 1)
  }

  const handleMoveChamber = (chamberId) => {
    if (!newDoctorId) return
    moveChamberToDoctor(chamberId, newDoctorId)
    setMovingChamberId(null)
    setNewDoctorId('')
    setRefresh(r => r + 1)
  }

  return (
    <PageShell
      eyebrow="Directory"
      title="Manage doctors"
      subtitle="Create profiles, adjust specialties, and reassign availability without leaving this cohesive workspace."
      heroSize="compact"
      contentMax="max-w-5xl"
      tone="blue"
      actions={
        <Link
          to="/admin/doctors/new"
          className="group inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/25 hover:bg-blue-50 transition-all"
        >
          Add doctor
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      <PageBackLink to="/admin">Admin dashboard</PageBackLink>

      <section className="mb-12">
        <h2 className="section-kicker mb-5 px-1">Doctors</h2>
        {doctors.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 font-medium rounded-[2rem]">
            No doctors yet. Add your first provider to get started.
          </div>
        ) : (
          <ul className="space-y-4">
            {doctors.map((doc) => (
              <li
                key={doc.id}
                className="card-interactive p-6 md:p-7 flex flex-wrap items-center justify-between gap-6 rounded-[1.75rem]"
              >
                <div>
                  <p className="font-medium text-slate-800">{doc.name}</p>
                  <p className="text-sm text-slate-600">{doc.qualification}</p>
                  <p className="text-xs text-slate-500">
                    Specialties: {doc.specializationIds?.map(id => SPECIALIZATIONS.find(s => s.id === id)?.name).filter(Boolean).join(', ') || '—'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Licensed states: {doc.licensedStates?.length ? doc.licensedStates.join(', ') : '—'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {chambers.filter(c => c.doctorId === doc.id).length} availability slot(s)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/doctors/${doc.id}/edit`}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                    className="btn-secondary text-sm text-red-600 border-red-100 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Reassign availability
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Move a chamber slot to another doctor when coverage changes.
            </p>
          </div>
        </div>
        {chambers.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 rounded-[2rem]">
            No availability slots yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {chambers.map((ch) => {
              const facility = getFacilityById(ch.facilityId || ch.clinicId)
              const currentDoctor = getDoctorById(ch.doctorId)
              return (
                <li
                  key={ch.id}
                  className="card p-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem]"
                >
                  <div>
                    <p className="font-medium text-slate-800">{facility?.name ?? 'Facility'}</p>
                    <p className="text-sm text-slate-600">{facility?.address}, {facility?.city}, {facility?.state}</p>
                    <p className="text-xs text-slate-500">Current doctor: {currentDoctor?.name ?? ch.doctorId}</p>
                  </div>
                  {movingChamberId === ch.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={newDoctorId}
                        onChange={(e) => setNewDoctorId(e.target.value)}
                        className="input-field w-48"
                      >
                        <option value="">Select doctor</option>
                        {doctors.filter(d => d.id !== ch.doctorId).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <button onClick={() => handleMoveChamber(ch.id)} className="btn-primary text-sm">Move</button>
                      <button onClick={() => { setMovingChamberId(null); setNewDoctorId('') }} className="btn-secondary text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMovingChamberId(ch.id); setNewDoctorId('') }}
                      className="btn-secondary text-sm"
                    >
                      Move to another doctor
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </PageShell>
  )
}

