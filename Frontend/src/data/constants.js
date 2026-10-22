// Specializations
export const SPECIALIZATIONS = [
  { id: 'spec_1', name: 'Cardiology', icon: '' },
  { id: 'spec_2', name: 'General Medicine', icon: '' },
  { id: 'spec_3', name: 'Orthopedics', icon: '' },
  { id: 'spec_4', name: 'Pediatrics', icon: '' },
  { id: 'spec_5', name: 'Dermatology', icon: '' },
  { id: 'spec_6', name: 'Neurology', icon: '' },
  { id: 'spec_7', name: 'ENT', icon: '' },
  { id: 'spec_8', name: 'Ophthalmology', icon: '' },
  { id: 'spec_9', name: 'Psychiatry', icon: '' },
  { id: 'spec_10', name: 'Gynecology', icon: '' },
]

// Generate time slots (e.g. 9:00 - 17:00, 30 min each)
export function generateTimeSlots(startHour = 9, endHour = 17, intervalMinutes = 30) {
  const slots = []
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const HH = String(h).padStart(2, '0')
      const MM = String(m).padStart(2, '0')
      slots.push(`${HH}:${MM}`)
    }
  }
  return slots
}

// Days of week for chamber availability
export const DAYS = [
  { id: 'mon', name: 'Monday' },
  { id: 'tue', name: 'Tuesday' },
  { id: 'wed', name: 'Wednesday' },
  { id: 'thu', name: 'Thursday' },
  { id: 'fri', name: 'Friday' },
  { id: 'sat', name: 'Saturday' },
  { id: 'sun', name: 'Sunday' },
]

// Get next N dates for calendar (starting from today)
export function getNextDates(count = 14) {
  const out = []
  const d = new Date()
  for (let i = 0; i < count; i++) {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    out.push(x.toISOString().slice(0, 10))
  }
  return out
}

// Date string to day id (mon, tue, ...)
export function dateToDayId(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return days[d.getDay()]
}

// Mock data regions (Virginia, Maryland, D.C. per requirements)
export const MOCK_STATES = ['Virginia', 'Maryland', 'District of Columbia']

// USA – states for facility/license location
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia',
]

// Patient appointment duration options (minutes)
export const APPOINTMENT_DURATIONS = [15, 30, 60]

// Facility medical equipment types for admin
export const EQUIPMENT_TYPES = ['X-Ray', 'MRI', 'CT Scanner', 'Ultrasound', 'EKG', 'Defibrillator', 'Ventilator', 'Other']

// Doctor shift: min 4 hours, max 8 hours per day at one facility
export const MIN_DOCTOR_HOURS_PER_DAY = 4
export const MAX_DOCTOR_HOURS_PER_DAY = 8
// Legacy alias
export const MAX_CLINIC_HOURS_PER_DAY = 4

// Max appointment duration for a patient (minutes) – overtime incurs fine
export const MAX_PATIENT_VISIT_MINUTES = 60

// Admin: single predefined account; no one can register as admin
export const ADMIN_EMAIL = 'admin@cureconnect.com'
