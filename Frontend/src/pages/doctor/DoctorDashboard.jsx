import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  MapPin,
  Stethoscope,
  UserRound,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getDoctorByUserId,
  getChambersByDoctorId,
  getAppointmentsByDoctorId,
  getFacilityById,
} from '../../services/api'
import { DAYS, getNextDates } from '../../data/constants'
import PageShell from '../../components/PageShell'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const doctor = getDoctorByUserId(user?.id)
  const chambers = doctor ? getChambersByDoctorId(doctor.id) : []
  const appointments = doctor
    ? getAppointmentsByDoctorId(doctor.id).filter((a) => a.status === 'confirmed')
    : []
  const upcoming = appointments.slice(0, 5)

  const [weekMode, setWeekMode] = useState('week1')
  const [, setRefresh] = useState(0)

  useEffect(() => {
    // Keep this dashboard "live" with admin changes in mock store.
    const t = setInterval(() => setRefresh((r) => r + 1), 10000)
    return () => clearInterval(t)
  }, [doctor?.id])

  const nextDates = useMemo(() => getNextDates(14) || [], [])
  const week1Dates = nextDates.slice(0, 7)
  const week2Dates = nextDates.slice(7, 14)
  const activeWeekDates = weekMode === 'week2' ? week2Dates : week1Dates

  // Only show days where the doctor has at least one availability configured.
  const availableDayIds = useMemo(() => {
    const set = new Set()
    ;(chambers || []).forEach((c) => {
      ;(c.availableDays || []).forEach((dayId) => set.add(dayId))
    })
    return set
  }, [chambers])

  const availableWeekDates = useMemo(() => {
    return (activeWeekDates || []).filter((dateStr) => {
      const dObj = new Date(dateStr + 'T12:00:00')
      const dayId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dObj.getDay()]
      return availableDayIds.has(dayId)
    })
  }, [activeWeekDates, availableDayIds])

  const chamberById = useMemo(() => {
    const m = {}
    ;(chambers || []).forEach((c) => {
      m[c.id] = c
    })
    return m
  }, [chambers])

  const appointmentsByDate = useMemo(() => {
    const map = {}
    activeWeekDates.forEach((d) => {
      map[d] = []
    })
    ;(appointments || []).forEach((apt) => {
      if (!map[apt.date]) return
      map[apt.date].push(apt)
    })
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => String(a.slotTime).localeCompare(String(b.slotTime)))
    })
    return map
  }, [activeWeekDates, appointments])

  const displayName = doctor?.name
    ? doctor.name.replace(/^Dr\.?\s*/i, '')
    : ''

  if (!doctor) {
    return (
      <PageShell
        eyebrow="Clinician"
        title="Profile not found"
        subtitle="We couldn’t match your login to a doctor record. Please contact support."
        heroSize="compact"
        contentMax="max-w-xl"
        tone="blue"
      />
    )
  }

  const quickLinks = [
    {
      to: '/doctor/chambers',
      title: 'My availability',
      desc: 'Set where and when you work. Future bookings update automatically.',
      icon: MapPin,
    },
    {
      to: '/doctor/appointments',
      title: 'Appointments',
      desc: 'Today’s roster, history, and visit duration logging.',
      icon: CalendarDays,
    },
    {
      to: '/doctor/profile',
      title: 'Profile & specialties',
      desc: 'Keep your bio and focus areas aligned with patient search.',
      icon: UserRound,
    },
  ]

  return (
    <PageShell
      eyebrow="Clinician portal"
      title={`Welcome back, Dr. ${displayName}`}
      subtitle="Your practice hub mirrors the public site—focused on schedule clarity and low-friction actions."
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <Stethoscope className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="section-kicker mb-3 px-1">Doctor schedule</h2>
            <p className="text-sm text-slate-500 font-medium max-w-2xl">
              Next 2 weeks of confirmed appointments (time, duration, patient, and
              facility). Admin updates reflect automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100/60 p-1.5 rounded-2xl w-fit shadow-inner shadow-slate-200/30">
            <button
              type="button"
              onClick={() => setWeekMode('week1')}
              className={`px-6 py-3 text-xs font-bold rounded-xl transition-all ${
                weekMode === 'week1'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Week 1
            </button>
            <button
              type="button"
              onClick={() => setWeekMode('week2')}
              className={`px-6 py-3 text-xs font-bold rounded-xl transition-all ${
                weekMode === 'week2'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Week 2
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-4">
            {availableWeekDates.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium">
                No available weekdays for this week.
              </p>
            ) : (
              availableWeekDates.map((dateStr) => {
              const dObj = new Date(dateStr + 'T12:00:00')
              const dayId = ['sun','mon','tue','wed','thu','fri','sat'][dObj.getDay()]
              const dayLabel = DAYS.find((d) => d.id === dayId)?.name ?? dayId
              const dayAppointments = appointmentsByDate[dateStr] || []

              return (
                <div
                  key={dateStr}
                  className="card p-5 md:p-6 rounded-[1.75rem] bg-white/70 ring-1 ring-slate-100"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {dayLabel}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {dObj.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-700" />
                      <p className="text-sm font-bold text-slate-700">
                        {dayAppointments.length} appointment{dayAppointments.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {dayAppointments.length === 0 ? (
                    <p className="text-sm text-slate-500 font-medium">
                      No appointments for this date.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {dayAppointments.map((apt) => {
                        const ch = chamberById[apt.chamberId]
                        const facility = ch ? getFacilityById(ch.facilityId || ch.clinicId) : null
                        const duration =
                          apt.bookedDurationMinutes != null
                            ? `${apt.bookedDurationMinutes} min`
                            : ch?.slotDurationMinutes
                              ? `${ch.slotDurationMinutes} min`
                              : '—'

                        return (
                          <li
                            key={apt.id}
                            className="bg-white border border-slate-100 rounded-[1.5rem] p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 hover:border-blue-200 transition-all"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {apt.patientName || 'Patient'}
                              </p>
                              <p className="text-xs text-slate-500 font-medium mt-1">
                                {facility?.name ?? 'Facility'} · {apt.date} at {apt.slotTime}
                              </p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-2">
                                Duration: {duration}
                              </p>
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                              Confirmed
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })
            )}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {quickLinks.map(({ to, title, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group card-interactive p-8 rounded-[2rem] flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
              <Icon className="w-6 h-6" strokeWidth={2.25} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
              {desc}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700 group-hover:gap-3 transition-all">
              Open
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="section-kicker px-1">Upcoming appointments</h2>
          <Link
            to="/doctor/appointments"
            className="text-sm font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 font-medium rounded-[2rem]">
            No upcoming appointments. Tune your availability to invite new
            bookings.
          </div>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((apt) => (
              <li
                key={apt.id}
                className="card-interactive p-6 rounded-[1.75rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-slate-900">{apt.patientName}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {apt.chamberName} · {apt.date} at {apt.slotTime}
                  </p>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 w-fit">
                  Confirmed
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  )
}
