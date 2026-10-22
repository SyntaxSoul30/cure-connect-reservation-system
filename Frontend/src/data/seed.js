import { initStore } from '../services/api'
import { SPECIALIZATIONS } from './constants'

const specIds = SPECIALIZATIONS.map(s => s.id)

const users = [
  { id: 'user_1', firstName: 'John', lastName: 'Patient', mobileNumber: '123-456-7890', email: 'patient@test.com', password: '123456', role: 'patient', creditCardNumber: '4111222233334444', cardholderName: 'John Patient', cvv: '123', expirationDate: '12/25', billingZip: '22202' },
  { id: 'user_2', firstName: 'Sarah', lastName: 'Smith', email: 'doctor@test.com', password: '123456', role: 'doctor' },
  { id: 'admin_1', firstName: 'CureConnect', lastName: 'Admin', email: 'admin@cureconnect.com', password: 'cureconnect', role: 'admin' },
]

// Doctors: specialties + states where licenses are valid (Virginia, Maryland, D.C. for mock)
const doctors = [
  { id: 'doc_1', userId: 'user_2', name: 'Dr. Sarah Smith', qualification: 'MD, MBBS', specializationIds: ['spec_1', 'spec_2'], licensedStates: ['Virginia', 'District of Columbia'], bio: 'Experienced cardiologist and general physician.' },
  { id: 'doc_2', userId: 'user_d2', name: 'Dr. James Wilson', qualification: 'MS Ortho', specializationIds: ['spec_3'], licensedStates: ['Maryland', 'Virginia'], bio: 'Orthopedic specialist with 15+ years experience.' },
  { id: 'doc_3', userId: 'user_d3', name: 'Dr. Emily Davis', qualification: 'MD Pediatrics', specializationIds: ['spec_4', 'spec_2'], licensedStates: ['Virginia', 'Maryland', 'District of Columbia'], bio: 'Caring pediatrician and family doctor.' },
  { id: 'doc_4', userId: 'user_d4', name: 'Dr. Michael Brown', qualification: 'MD Dermatology', specializationIds: ['spec_5'], licensedStates: ['District of Columbia'], bio: 'Skin and allergy specialist.' },
]

// Facilities: Virginia, Maryland, D.C. – operating hours, rooms, equipment
const facilities = [
  { id: 'fac_va1', name: 'CureConnect Arlington', address: '123 Medical Tower, Wilson Blvd', state: 'Virginia', city: 'Arlington', zipCode: '22201', openTime: '08:00', closeTime: '18:00', roomsAvailable: 8, equipment: [{ type: 'X-Ray', count: 2 }, { type: 'EKG', count: 4 }] },
  { id: 'fac_va2', name: 'CureConnect Fairfax', address: '456 Health Plaza, Main St', state: 'Virginia', city: 'Fairfax', zipCode: '22030', openTime: '07:00', closeTime: '20:00', roomsAvailable: 12, equipment: [{ type: 'MRI', count: 1 }, { type: 'CT Scanner', count: 1 }, { type: 'Ultrasound', count: 2 }] },
  { id: 'fac_va3', name: 'CureConnect Richmond', address: '789 Broad St', state: 'Virginia', city: 'Richmond', zipCode: '23219', openTime: '08:00', closeTime: '17:00', roomsAvailable: 6, equipment: [{ type: 'X-Ray', count: 1 }, { type: 'EKG', count: 3 }] },
  { id: 'fac_md1', name: 'CureConnect Bethesda', address: '100 Wisconsin Ave', state: 'Maryland', city: 'Bethesda', zipCode: '20814', openTime: '07:30', closeTime: '19:00', roomsAvailable: 10, equipment: [{ type: 'MRI', count: 1 }, { type: 'X-Ray', count: 2 }, { type: 'Ultrasound', count: 2 }] },
  { id: 'fac_md2', name: 'CureConnect Silver Spring', address: '200 Colesville Rd', state: 'Maryland', city: 'Silver Spring', zipCode: '20910', openTime: '08:00', closeTime: '18:00', roomsAvailable: 7, equipment: [{ type: 'CT Scanner', count: 1 }, { type: 'EKG', count: 4 }] },
  { id: 'fac_dc1', name: 'CureConnect DC Downtown', address: '500 15th St NW', state: 'District of Columbia', city: 'Washington', zipCode: '20004', openTime: '08:00', closeTime: '20:00', roomsAvailable: 15, equipment: [{ type: 'MRI', count: 2 }, { type: 'CT Scanner', count: 1 }, { type: 'X-Ray', count: 3 }, { type: 'Ultrasound', count: 3 }] },
  { id: 'fac_dc2', name: 'CureConnect Georgetown', address: '3300 M St NW', state: 'District of Columbia', city: 'Washington', zipCode: '20007', openTime: '09:00', closeTime: '17:00', roomsAvailable: 5, equipment: [{ type: 'X-Ray', count: 1 }, { type: 'EKG', count: 2 }] },
]

// Chambers = doctor availability at a facility (where and when per weekday). facilityId for compatibility.
const chambers = [
  { id: 'ch_1', doctorId: 'doc_1', facilityId: 'fac_va1', clinicId: 'fac_va1', slotDurationMinutes: 30, availableDays: ['mon', 'wed', 'fri'], slotStart: '09:00', slotEnd: '13:00', consultationCharge: 120 },
  { id: 'ch_2', doctorId: 'doc_1', facilityId: 'fac_dc1', clinicId: 'fac_dc1', slotDurationMinutes: 30, availableDays: ['tue', 'thu'], slotStart: '10:00', slotEnd: '14:00', consultationCharge: 100 },
  { id: 'ch_3', doctorId: 'doc_2', facilityId: 'fac_md1', clinicId: 'fac_md1', slotDurationMinutes: 30, availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], slotStart: '09:00', slotEnd: '13:00', consultationCharge: 150 },
  { id: 'ch_4', doctorId: 'doc_3', facilityId: 'fac_dc1', clinicId: 'fac_dc1', slotDurationMinutes: 30, availableDays: ['mon', 'wed', 'fri'], slotStart: '08:00', slotEnd: '12:00', consultationCharge: 90 },
]

const appointments = [
  {
    id: 'apt_1',
    patientId: 'user_1',
    doctorId: 'doc_1',
    chamberId: 'ch_1',
    date: new Date().toISOString().slice(0, 10),
    slotTime: '10:00',
    status: 'confirmed',
    patientName: 'John Patient',
    bookedDurationMinutes: 30,
    charge: 120,
  },
]

initStore({ users, doctors, chambers, facilities, appointments })

export { users, doctors, chambers, facilities, appointments }
