import { isValidPhone, phoneValidationMessage } from './phone'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trim(s) {
  return String(s ?? '').trim()
}

/**
 * If user started entering card details, all payment fields must be valid.
 * Returns { fieldErrors, list } — list is ordered messages for summary UI.
 */
export function validateRegisterForm(data) {
  /** @type {Record<string, string>} */
  const fieldErrors = {}
  const list = []

  const firstName = trim(data.firstName)
  const lastName = trim(data.lastName)
  const email = trim(data.email)
  const password = data.password ?? ''

  if (!firstName) {
    fieldErrors.firstName = 'First name is required.'
    list.push(fieldErrors.firstName)
  }
  if (!lastName) {
    fieldErrors.lastName = 'Last name is required.'
    list.push(fieldErrors.lastName)
  }
  if (!email) {
    fieldErrors.email = 'Email is required.'
    list.push(fieldErrors.email)
  } else if (!EMAIL_RE.test(email)) {
    fieldErrors.email = 'Enter a valid email address (e.g. name@example.com).'
    list.push(fieldErrors.email)
  }
  if (!isValidPhone(data.phone)) {
    fieldErrors.phone = phoneValidationMessage()
    list.push(fieldErrors.phone)
  }
  if (!password) {
    fieldErrors.password = 'Password is required.'
    list.push(fieldErrors.password)
  } else if (password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters.'
    list.push(fieldErrors.password)
  }

  const cardholderName = trim(data.cardholderName)
  const cardDigits = String(data.creditCardNumber ?? '').replace(/\D/g, '')
  const exp = trim(data.expirationDate)
  const cvvDigits = String(data.cvv ?? '').replace(/\D/g, '')
  const zip = trim(data.billingZip)

  const anyPayment =
    cardholderName ||
    cardDigits.length > 0 ||
    exp ||
    cvvDigits.length > 0 ||
    zip

  if (anyPayment) {
    const parts = []
    if (!cardholderName) parts.push('cardholder name')
    if (cardDigits.length !== 16 && cardDigits.length !== 15) {
      parts.push('a valid card number (15 digits for Amex, 16 for most cards)')
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) parts.push('expiry as MM/YY')
    if (cvvDigits.length < 3 || cvvDigits.length > 4) parts.push('a valid CVV (3–4 digits)')
    if (!/^\d{5}(-\d{4})?$/.test(zip.replace(/\s/g, ''))) {
      parts.push('a valid billing ZIP (5 digits or ZIP+4)')
    }
    if (parts.length > 0) {
      fieldErrors.payment =
        parts.length === 1
          ? `Payment: enter ${parts[0]}.`
          : `Payment: complete all fields — missing or invalid: ${parts.join(', ')}.`
      list.push(fieldErrors.payment)
    }
  }

  return { fieldErrors, list }
}
