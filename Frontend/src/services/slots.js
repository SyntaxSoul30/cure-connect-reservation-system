// Generate time slots between slotStart "HH:MM" and slotEnd "HH:MM" with interval minutes
export function chamberTimeSlots(slotStart, slotEnd, intervalMinutes) {
  const [sh, sm] = slotStart.split(':').map(Number)
  const [eh, em] = slotEnd.split(':').map(Number)
  const startM = sh * 60 + sm
  const endM = eh * 60 + em
  const slots = []
  for (let m = startM; m < endM; m += intervalMinutes) {
    const h = Math.floor(m / 60)
    const mi = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`)
  }
  return slots
}
