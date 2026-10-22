import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { getFacilityById, addFacility, updateFacility } from '../../services/api'
import { SPECIALIZATIONS, MOCK_STATES } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

const defaultForm = {
  name: '',
  address: '',
  state: 'Virginia',
  city: '',
  zipCode: '',
  openTime: '08:00',
  closeTime: '18:00',
  roomsAvailable: 4,
  specializationIds: [],
}

export default function AdminFacilityForm() {
  const { facilityId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(facilityId)

  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (isEdit) {
      const data = getFacilityById(facilityId)
      if (data) {
        setForm({
          ...defaultForm,
          ...data,
          specializationIds: data.specializationIds || [],
        })
      }
    }
  }, [facilityId, isEdit])

  const toggleSpec = (id) => {
    setForm((f) => ({
      ...f,
      specializationIds: f.specializationIds.includes(id)
        ? f.specializationIds.filter((x) => x !== id)
        : [...f.specializationIds, id],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEdit) updateFacility(facilityId, form)
    else addFacility(form)
    navigate('/admin/facilities')
  }

  return (
    <PageShell
      eyebrow="Facilities"
      title={isEdit ? 'Edit facility' : 'Add facility'}
      subtitle="Location details and supported specialities—aligned with how doctors and patients see the network."
      heroSize="compact"
      contentMax="max-w-2xl"
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <Building2 className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to="/admin/facilities">Facility list</PageBackLink>

      <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-8 rounded-[2rem]">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facility name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
            <select
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="input-field"
            >
              {MOCK_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Street address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rooms</label>
            <input
              type="number"
              value={form.roomsAvailable}
              onChange={(e) =>
                setForm((f) => ({ ...f, roomsAvailable: parseInt(e.target.value, 10) || 1 }))
              }
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Supported specialities</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpec(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  form.specializationIds.includes(s.id)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">
            {isEdit ? 'Save changes' : 'Create facility'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/facilities')}
            className="px-6 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </PageShell>
  )
}
