import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { getFacilities, deleteFacility, getChambersByFacilityId } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function AdminFacilities() {
  const [, setRefresh] = useState(0)
  const [error, setError] = useState('')
  const facilities = getFacilities()

  const handleDelete = (id, name) => {
    const chambers = getChambersByFacilityId(id)
    if (chambers.length > 0) {
      setError(`Access denied: This facility is tied to ${chambers.length} active doctor schedules.`)
      return
    }
    if (!window.confirm(`Permanently remove "${name}"?`)) return
    deleteFacility(id)
    setRefresh((r) => r + 1)
  }

  return (
    <PageShell
      eyebrow="Admin"
      title="Facility management"
      subtitle="Manage physical locations and their medical speciality support."
      tone="blue"
      actions={
        <Link
          to="/admin/facilities/new"
          className="group inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/25 hover:bg-blue-50 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Building2 className="w-4 h-4" />
          Add facility
        </Link>
      }
    >
      <PageBackLink to="/admin">Admin dashboard</PageBackLink>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl mb-6 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {facilities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-sm italic card">
            No facilities registered.
          </div>
        ) : (
          facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap items-start justify-between gap-4 shadow-sm hover:border-blue-200 transition-colors card"
            >
              <div className="flex-1">
                <p className="font-bold text-slate-900">{fac.name}</p>
                <p className="text-xs text-slate-500 mb-3">
                  {fac.address}, {fac.city}, {fac.state}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {fac.specializationIds?.length > 0 ? (
                    fac.specializationIds.map((id) => {
                      const spec = SPECIALIZATIONS.find((s) => s.id === id)
                      return (
                        <span
                          key={id}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-black uppercase tracking-wider border border-blue-100/80"
                        >
                          {spec?.name || 'Unknown spec'}
                        </span>
                      )
                    })
                  ) : (
                    <span className="text-[10px] text-slate-300 italic">No specialities assigned</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/admin/facilities/${fac.id}/edit`}
                  className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100 hover:bg-white transition-all"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(fac.id, fac.name)}
                  className="px-4 py-1.5 bg-white text-red-400 rounded-lg text-xs font-bold border border-red-50 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageShell>
  )
}
