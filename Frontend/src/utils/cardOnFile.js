const STORAGE_KEY = 'cureconnect_card_on_file'

export function readCardOnFile(email) {
  if (!email) return null
  const key = String(email).trim().toLowerCase()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || String(data.email || '').trim().toLowerCase() !== key) return null
    return {
      lastFour: data.lastFour || '',
      cardholderName: data.cardholderName || '',
    }
  } catch {
    return null
  }
}

export function writeCardOnFile(email, { lastFour, cardholderName } = {}) {
  if (!email || !lastFour || String(lastFour).length !== 4) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      email: String(email).trim().toLowerCase(),
      lastFour: String(lastFour).slice(-4),
      cardholderName: cardholderName || '',
    }),
  )
}

export function clearCardOnFile() {
  localStorage.removeItem(STORAGE_KEY)
}
