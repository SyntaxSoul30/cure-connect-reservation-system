import { createContext, useContext, useState, useEffect } from 'react'
import { ADMIN_EMAIL } from '../data/constants'
import { loginUser, logoutUser, registerPatient } from '../services/authApi'
import { readCardOnFile } from '../utils/cardOnFile'
import { readDisplayProfile, greetingFirstNameFromEmail } from '../utils/displayProfile'

const AuthContext = createContext(null)

const STORAGE_KEY = 'cureconnect_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      const isLoginSuccess = await loginUser({ email, password })
      if (!isLoginSuccess) return { error: 'Invalid email or password.' }

      const display = readDisplayProfile(email)
      const firstName =
        display?.firstName?.trim() || greetingFirstNameFromEmail(email)
      const lastName = display?.lastName?.trim() || ''
      let sessionUser = {
        email,
        role,
        firstName,
        lastName,
        name: [firstName, lastName].filter(Boolean).join(' ') || firstName,
      }
      const onFile = readCardOnFile(email)
      if (onFile?.lastFour) {
        sessionUser = {
          ...sessionUser,
          cardLastFour: onFile.lastFour,
          cardholderName: onFile.cardholderName,
          hasSavedCard: true,
        }
      }
      setUser(sessionUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
      return { ok: true, user: sessionUser }
    } catch (err) {
      return { error: err?.response?.data?.message || 'Login failed. Please try again.' }
    }
  }

  const register = async (data) => {
    if (data.email && data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { error: 'This email is reserved. Admins cannot be created via registration.' }
    }
    if (data.role === 'admin') return { error: 'Invalid role.' }

    try {
      const isRegistrationSuccess = await registerPatient(data)
      if (!isRegistrationSuccess) {
        return { error: 'Registration failed. Email or mobile may already exist.' }
      }

      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
      return { ok: true }
    } catch (err) {
      return { error: err?.response?.data?.message || 'Registration failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (_) {}
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const setUserSession = (nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser: setUserSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
