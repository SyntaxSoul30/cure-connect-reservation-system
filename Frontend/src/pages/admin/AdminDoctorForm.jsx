import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import { getDoctorById, addDoctor, updateDoctor } from '../../services/api'
import { SPECIALIZATIONS, MOCK_STATES } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

const defaultForm = {
  name: '',
  qualification: '',
  specializationIds: [],
  licensedStates: [],
  bio: '',
}

export default function AdminDoctorForm() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(doctorId)
  const doctor = isEdit ? getDoctorById(doctorId) : null

  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || '',
        qualification: doctor.qualification || '',
        specializationIds: doctor.specializationIds || [],
        licensedStates: doctor.licensedStates || [],
        bio: doctor.bio || '',
      })
    }
  }, [doctor])

  const toggleSpec = (id) => {
    setForm(f => ({
      ...f,
      specializationIds: f.specializationIds.includes(id) ? f.specializationIds.filter(x => x !== id) : [...f.specializationIds, id],
    }))
  }

  const toggleState = (state) => {
    setForm(f => ({
      ...f,
      licensedStates: f.licensedStates.includes(state) ? f.licensedStates.filter(x => x !== state) : [...f.licensedStates, state],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name?.trim()) { setError('Name is required'); return }
    if (form.licensedStates.length === 0) { setError('Select at least one state where the doctor is licensed.'); return }

    if (isEdit) {
      updateDoctor(doctorId, form)
    } else {
      addDoctor({ ...form, userId: `user_doc_${Date.now()}` })
    }
    navigate('/admin/doctors')
  }

  return (
    <PageShell
      eyebrow="Directory"
      title={isEdit ? 'Update doctor' : 'Add doctor'}
      subtitle="Credentials, specialties, and licensed regions—presented with the same clarity as the patient-facing experience."
      heroSize="compact"
      contentMax="max-w-2xl"
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <Stethoscope className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to="/admin/doctors">Manage doctors</PageBackLink>

      <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-8 rounded-[2rem]">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Dr. Jane Doe" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
          <input type="text" value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} className="input-field" placeholder="MD, MBBS" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Specialties (licensed in)</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpec(s.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.specializationIds.includes(s.id) ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">States where license is valid</label>
          <div className="flex flex-wrap gap-2">
            {MOCK_STATES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleState(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.licensedStates.includes(s) ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input-field min-h-[80px]" placeholder="Short bio" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{isEdit ? 'Save changes' : 'Add doctor'}</button>
          <Link to="/admin/doctors" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </PageShell>
  )
}

