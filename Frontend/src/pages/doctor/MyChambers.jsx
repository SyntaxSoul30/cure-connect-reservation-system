import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getDoctorByUserId,
  getChambersByDoctorId,
  getFacilityById,
  deleteChamber,
} from '../../services/api'
import { DAYS } from '../../data/constants'
import PageShell from '../../components/PageShell'

export default function MyChambers() {
  const { user } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const doctor = getDoctorByUserId(user?.id)
  const chambers = doctor ? getChambersByDoctorId(doctor.id) : []

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete chamber "${name}"?`)) {
      deleteChamber(id)
      setRefresh((r) => r + 1)
    }
  }

  if (!doctor) return null

  return (
    <PageShell
      eyebrow="Availability"
      title="My availability"
      subtitle="Define where you practice and when patients can book. Edits apply to future reservations only."
      heroSize="compact"
      contentMax="max-w-4xl"
      tone="blue"
      actions={
        <Link
          to="/doctor/chambers/new"
          className="group inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/30 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add availability
        </Link>
      }
    >
      {chambers.length === 0 ? (
        <div className="card p-14 text-center rounded-[2rem]">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium mb-8 max-w-md mx-auto">
            You haven&apos;t set any availability yet. Add your first location
            and hours to appear in patient search.
          </p>
          <Link to="/doctor/chambers/new" className="btn-primary inline-flex">
            Add your first availability
          </Link>
        </div>
      ) : (
        <ul key={refresh} className="space-y-4">
          {chambers.map((ch) => {
            const facility = getFacilityById(ch.facilityId || ch.clinicId)
            return (
              <li
                key={ch.id}
                className="card-interactive p-6 md:p-8 rounded-[1.75rem]"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg">
                        {facility?.name ?? 'Facility'}
                      </h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {facility?.address}
                      </p>
                      <p className="text-sm text-slate-400 font-medium">
                        {facility?.city}, {facility?.state} {facility?.zipCode}
                      </p>
                      <p className="text-xs text-slate-500 font-bold mt-3 uppercase tracking-wide">
                        {ch.slotStart}–{ch.slotEnd} · {ch.slotDurationMinutes}{' '}
                        min slots · ${ch.consultationCharge ?? 0}/visit
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Weekdays:{' '}
                        {ch.availableDays
                          ?.map((d) => DAYS.find((x) => x.id === d)?.name || d)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/doctor/chambers/${ch.id}/edit`}
                      className="btn-secondary text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(ch.id, facility?.name ?? 'Slot')
                      }
                      className="btn-secondary text-sm text-red-600 border-red-100 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
