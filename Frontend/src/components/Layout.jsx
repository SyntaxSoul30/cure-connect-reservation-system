import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const role = (user?.role || '').toLowerCase().trim()
  const path = location.pathname

  const navPatient = [
    { to: '/patient', label: 'Dashboard', active: path === '/patient' },
    {
      to: '/patient/doctors',
      label: 'Find Specialists',
      active:
        path.startsWith('/patient/doctors') || path.includes('/patient/book'),
    },
    {
      to: '/patient/appointments',
      label: 'My Bookings',
      active: path.startsWith('/patient/appointments'),
    },
  ]

  const navAdmin = [
    { to: '/admin', label: 'Dashboard', active: path === '/admin' },
    {
      to: '/admin/doctors',
      label: 'Doctors',
      active: path.startsWith('/admin/doctors'),
    },
    {
      to: '/admin/facilities',
      label: 'Facilities',
      active: path.startsWith('/admin/facilities'),
    },
  ]

  const navDoctor = [
    { to: '/doctor', label: 'Dashboard', active: path === '/doctor' },
    {
      to: '/doctor/chambers',
      label: 'Availability',
      active: path.startsWith('/doctor/chambers'),
    },
    {
      to: '/doctor/appointments',
      label: 'Appointments',
      active: path.startsWith('/doctor/appointments'),
    },
  ]

  let navItems = []
  let accountHref = '/'
  let accountLabel = 'Account'
  let accountActive = false
  let roleAccent = '#047857'
  let roleThemeClass = 'theme-emerald'

  if (role === 'patient') {
    navItems = navPatient
    accountHref = '/patient/profile'
    accountLabel = 'My Account'
    accountActive = path.startsWith('/patient/profile')
    roleAccent = '#BE123C'
    roleThemeClass = 'theme-rose'
  } else if (role === 'admin') {
    navItems = navAdmin
    accountHref = '/admin'
    accountLabel = 'Overview'
    accountActive = path === '/admin'
    roleAccent = '#1D4ED8'
    roleThemeClass = 'theme-blue'
  } else if (role === 'doctor') {
    navItems = navDoctor
    accountHref = '/doctor/profile'
    accountLabel = 'Profile'
    accountActive = path.startsWith('/doctor/profile')
    roleAccent = '#1D4ED8'
    roleThemeClass = 'theme-blue'
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#FBFCFD] ${roleThemeClass}`}>
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/70 sticky top-0 z-50 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.45)]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg shadow-slate-300/40 group-hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: roleAccent }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              WeCure<span style={{ color: roleAccent }}>IT</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 md:gap-8">
            {user && navItems.length > 0 && (
              <>
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map(({ to, label, active }) => (
                    <NavLink
                      key={to}
                      to={to}
                      label={label}
                      active={active}
                      accent={roleAccent}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 md:gap-4 md:ml-2 md:pl-6 md:border-l border-slate-100">
                  <Link
                    to={accountHref}
                    className={`text-sm font-bold transition-all ${
                      accountActive
                        ? ''
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                    style={accountActive ? { color: roleAccent } : undefined}
                  >
                    {accountLabel}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>

        {user && navItems.length > 0 && (
          <div className="md:hidden border-t border-slate-50 bg-white px-4 py-2 flex gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? 'nav-chip-active'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

function NavLink({ to, label, active, accent }) {
  return (
    <Link
      to={to}
      className={`relative text-sm font-bold transition-all ${
        active ? '' : 'text-slate-400 hover:text-slate-600'
      }`}
      style={active ? { color: accent } : undefined}
    >
      {label}
      {active && (
        <span
          className="absolute -bottom-[28px] left-0 w-full h-1 rounded-full hidden md:block"
          style={{ backgroundColor: accent }}
        />
      )}
    </Link>
  )
}
