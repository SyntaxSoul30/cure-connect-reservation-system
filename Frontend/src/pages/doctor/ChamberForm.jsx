import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CalendarRange } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId, getChamberById, getFacilityById, getFacilitiesByState, addChamber, updateChamber } from '../../services/api'
import { DAYS, MOCK_STATES, MIN_DOCTOR_HOURS_PER_DAY, MAX_DOCTOR_HOURS_PER_DAY } from '../../data/constants'
import { chamberTimeSlots } from '../../services/slots'
import PageShell, { PageBackLink } from '../../components/PageShell'

const defaultForm = {
  facilityId: '',
  clinicId: '',
  slotStart: '09:00',
  slotEnd: '13:00',
  slotDurationMinutes: 30,
  availableDays: [],
  consultationCharge: 80,
}

export default function ChamberForm() {
  const { chamberId } = useParams()
  const isEdit = Boolean(chamberId)
  const navigate = useNavigate()
  const { user } = useAuth()
  const doctor = getDoctorByUserId(user?.id)
  const existing = chamberId ? getChamberById(chamberId) : null

  const [selectedState, setSelectedState] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const facilitiesInState = selectedState ? getFacilitiesByState(selectedState) : []

  useEffect(() => {
    if (existing) {
      const fid = existing.facilityId || existing.clinicId
      const facility = getFacilityById(fid)
      setSelectedState(facility?.state || '')
      setForm({
        facilityId: fid || '',
        clinicId: fid || '',
        slotStart: existing.slotStart || '09:00',
        slotEnd: existing.slotEnd || '13:00',
        slotDurationMinutes: existing.slotDurationMinutes ?? 30,
        availableDays: existing.availableDays || [],
        consultationCharge: existing.consultationCharge ?? 80,
      })
    }
  }, [existing])

  const minMinutes = MIN_DOCTOR_HOURS_PER_DAY * 60
  const maxMinutes = MAX_DOCTOR_HOURS_PER_DAY * 60
  const slotWindowMinutes = (() => {
    const [sh, sm] = (form.slotStart || '09:00').split(':').map(Number)
    const [eh, em] = (form.slotEnd || '13:00').split(':').map(Number)
    return (eh * 60 + em) - (sh * 60 + sm)
  })()
  const tooShort = slotWindowMinutes < minMinutes
  const tooLong = slotWindowMinutes > maxMinutes
  const selectedFacility = (form.facilityId || form.clinicId) ? getFacilityById(form.facilityId || form.clinicId) : null

  const toggleDay = (dayId) => {
    setForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(dayId)
        ? prev.availableDays.filter(d => d !== dayId)
        : [...prev.availableDays, dayId],
    }))
  }

  const slotPreview = chamberTimeSlots(form.slotStart, form.slotEnd, form.slotDurationMinutes)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const fid = form.facilityId || form.clinicId
    if (!fid) { setError('Please select a facility.'); return }
    if (form.availableDays.length === 0) { setError('Select at least one weekday.'); return }
    if (tooShort) { setError(`Shift must be at least ${MIN_DOCTOR_HOURS_PER_DAY} hours per day.`); return }
    if (tooLong) { setError(`Doctors can work at most ${MAX_DOCTOR_HOURS_PER_DAY} hours per day at one facility.`); return }
    if (form.consultationCharge == null || form.consultationCharge < 0) { setError('Consultation charge must be 0 or more'); return }
    if (!doctor) return

    const payload = { ...form, facilityId: fid, clinicId: fid, doctorId: doctor.id }
    if (isEdit) {
      updateChamber(chamberId, payload)
    } else {
      addChamber(payload)
    }
    navigate('/doctor/chambers')
  }

  if (!doctor) return null

  return (
    <PageShell
      eyebrow="Scheduling"
      title={isEdit ? 'Edit availability' : 'Add availability'}
      subtitle="Pick a facility, define your shift window, and choose weekdays. Patients only see compliant slots."
      heroSize="compact"
      contentMax="max-w-2xl"
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <CalendarRange className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to="/doctor/chambers">Back to availability</PageBackLink>

      <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-8 rounded-[2rem]">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setForm(f => ({ ...f, facilityId: '', clinicId: '' })) }}
            className="input-field"
            required
          >
            <option value="">Select state</option>
            {MOCK_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facility</label>
            <select
              value={form.facilityId || form.clinicId}
              onChange={(e) => setForm(f => ({ ...f, facilityId: e.target.value, clinicId: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select facility</option>
              {facilitiesInState.map(fac => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} – {fac.address}, {fac.city} {fac.zipCode}
                </option>
              ))}
            </select>
            {facilitiesInState.length === 0 && <p className="text-sm text-slate-500 mt-1">No facilities in this state yet.</p>}
            {selectedFacility && (
              <p className="text-xs text-slate-500 mt-2">
                {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} {selectedFacility.zipCode}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Consultation charge (USD)</label>
          <input
            type="number"
            min={0}
            step={5}
            value={form.consultationCharge}
            onChange={(e) => setForm(f => ({ ...f, consultationCharge: Number(e.target.value) || 0 }))}
            className="input-field"
          />
          <p className="text-xs text-slate-500 mt-1">Per appointment. Max visit duration for patients is 1 hour; overtime may incur a fine.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slot start</label>
            <input
              type="time"
              value={form.slotStart}
              onChange={(e) => setForm(f => ({ ...f, slotStart: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slot end</label>
            <input
              type="time"
              value={form.slotEnd}
              onChange={(e) => setForm(f => ({ ...f, slotEnd: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slot duration (minutes)</label>
          <select
            value={form.slotDurationMinutes}
            onChange={(e) => setForm(f => ({ ...f, slotDurationMinutes: Number(e.target.value) }))}
            className="input-field"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
        {(tooShort || tooLong) && (
          <p className="text-red-600 text-sm">
            {tooShort && `Shift must be at least ${MIN_DOCTOR_HOURS_PER_DAY} hours. `}
            {tooLong && `Doctors can work at most ${MAX_DOCTOR_HOURS_PER_DAY} hours per day at one facility.`}
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Available weekdays</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDay(d.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.availableDays.includes(d.id) ? 'bg-blue-700 text-white shadow-md shadow-blue-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
        {slotPreview.length > 0 && (
          <p className="text-xs text-slate-500">Preview: {slotPreview.length} slots per day ({slotPreview[0]} – {slotPreview[slotPreview.length - 1]})</p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{isEdit ? 'Save changes' : 'Add availability'}</button>
          <Link to="/doctor/chambers" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </PageShell>
  )
}

