const STORAGE_KEY = 'cureconnect_display_profiles_v1'

export function writeDisplayProfile(email, { firstName, lastName } = {}) {
  if (!email) return
  const key = String(email).trim().toLowerCase()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const map = raw ? JSON.parse(raw) : {}
    map[key] = {
      firstName: String(firstName ?? '').trim(),
      lastName: String(lastName ?? '').trim(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota / parse */
  }
}

export function readDisplayProfile(email) {
  if (!email) return null
  const key = String(email).trim().toLowerCase()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const map = JSON.parse(raw)
    const row = map[key]
    if (!row || (!row.firstName && !row.lastName)) return null
    return row
  } catch {
    return null
  }
}

/** When we only have email (no stored profile), derive a readable first token — not the raw address. */
export function greetingFirstNameFromEmail(email) {
  if (!email || !String(email).includes('@')) return 'there'
  const local = String(email).split('@')[0]
  const parts = local.split(/[._\-+]+/).filter(Boolean)
  if (parts.length === 0) return 'there'
  return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
}
