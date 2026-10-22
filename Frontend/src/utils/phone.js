/**
 * Strips non-digits for validation and comparison.
 */
export function normalizePhoneDigits(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

/**
 * Accepts common US and international formats: 10–15 digits (E.164 max length).
 * US: 10 digits, or 11 digits starting with country code 1.
 */
export function isValidPhone(phone) {
  const d = normalizePhoneDigits(phone)
  if (d.length < 10 || d.length > 15) return false
  if (d.length === 11 && !d.startsWith('1')) return false
  return true
}

export function phoneValidationMessage() {
  return 'Enter a valid phone number (10–15 digits; US numbers may include a leading 1).'
}
