import { useState } from 'react'
import { ClipboardList, FileText, History, StickyNote } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getDoctorByUserId,
  getAppointmentsByDoctorId,
  setAppointmentActualDuration,
  setAppointmentDoctorNotes,
  getDoctorNotesHistory,
} from '../../services/api'
import { MAX_PATIENT_VISIT_MINUTES } from '../../data/constants'
import PageShell from '../../components/PageShell'

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [, setRefresh] = useState(0)
  const [recordingId, setRecordingId] = useState(null)
  const [actualMinutes, setActualMinutes] = useState('')
  const [notesDraftByAptId, setNotesDraftByAptId] = useState({})
  const [notesModalAptId, setNotesModalAptId] = useState(null)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [isReviewHistoryOpen, setIsReviewHistoryOpen] = useState(false)
  const doctor = getDoctorByUserId(user?.id)
  const appointments = doctor ? getAppointmentsByDoctorId(doctor.id) : []
  const today = new Date().toISOString().slice(0, 10)
  const notesModalApt = notesModalAptId
    ? appointments.find((a) => a.id === notesModalAptId)
    : null
  const upcoming = appointments.filter(
    (a) => a.status === 'confirmed' && a.date >= today,
  )
  const past = appointments.filter(
    (a) =>
      a.status === 'cancelled' ||
      a.status === 'completed' ||
      a.date < today,
  )

  const handleRecordVisit = (apt) => {
    const mins = parseInt(actualMinutes, 10)
    if (mins < 0 || mins > 120) return
    setAppointmentActualDuration(apt.id, mins)
    setRecordingId(null)
    setActualMinutes('')
    setRefresh((r) => r + 1)
  }

  const handleSaveNotes = (apt) => {
    const draft = notesDraftByAptId[apt.id] ?? apt.doctorNotes ?? ''
    const notes = String(draft)
    if (notes.trim().length === 0) return
    setAppointmentDoctorNotes(apt.id, notes)
    setRefresh((r) => r + 1)
  }

  const openNotesModal = (apt) => {
    setNotesModalAptId(apt.id)
    setIsReviewHistoryOpen(false)
    setIsNotesModalOpen(true)
  }

  const closeNotesModal = () => {
    setIsNotesModalOpen(false)
    setNotesModalAptId(null)
    setIsReviewHistoryOpen(false)
  }

  if (!doctor) return null

  return (
    <PageShell
      eyebrow="Schedule"
      title="Appointments"
      subtitle="Everything patients have booked with you—log visit duration and track outcomes in one scroll."
      heroSize="compact"
      contentMax="max-w-4xl"
      tone="blue"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <ClipboardList className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <section className="mb-12">
        <h2 className="section-kicker mb-5 px-1">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 font-medium rounded-[2rem]">
            No upcoming appointments on file.
          </div>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((apt) => (
              <li
                key={apt.id}
                className="card-interactive p-6 rounded-[1.75rem]"
              >
                <p className="font-bold text-slate-900">{apt.patientName}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {apt.chamberName ?? 'Facility'} · {apt.date} at{' '}
                  {apt.slotTime}
                </p>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  Booked {apt.bookedDurationMinutes ?? 30} min · $
                  {apt.charge ?? 0}
                </p>
                {apt.date <= today && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="grid lg:grid-cols-2 gap-4 items-start">
                      {/* Left: actual duration */}
                      <div>
                        {recordingId === apt.id ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="text-sm text-slate-600 font-medium">
                              Actual visit (min):
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={120}
                              value={actualMinutes}
                              onChange={(e) => setActualMinutes(e.target.value)}
                              className="input-field w-24"
                            />
                            <button
                              type="button"
                              onClick={() => handleRecordVisit(apt)}
                              className="btn-primary text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRecordingId(null)
                                setActualMinutes('')
                              }}
                              className="btn-secondary text-sm"
                            >
                              Cancel
                            </button>
                            <span className="text-xs text-slate-400 font-medium">
                              Max {MAX_PATIENT_VISIT_MINUTES} min. Overtime may incur a fine.
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setRecordingId(apt.id)
                              setActualMinutes(
                                String(apt.bookedDurationMinutes || 30),
                              )
                            }}
                            className="btn-secondary text-sm"
                          >
                            Record visit & set actual duration
                          </button>
                        )}
                      </div>

                      {/* Right: Log visit (opens notes modal) */}
                      <div className="flex items-start justify-end">
                        <button
                          type="button"
                          onClick={() => openNotesModal(apt)}
                          className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                          <StickyNote className="w-4 h-4" />
                          Log Visit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="section-kicker mb-5 px-1">History</h2>
        {past.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 font-medium rounded-[2rem]">
            No past visits yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {past.map((apt) => (
              <li
                key={apt.id}
                className="card p-6 rounded-[1.75rem] opacity-95 hover:opacity-100 transition-opacity"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      {apt.patientName}
                    </p>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {apt.chamberName} · {apt.date} at {apt.slotTime} · $
                      {apt.charge ?? 0}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                      apt.status === 'cancelled'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : apt.status === 'completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                {apt.status !== 'cancelled' && apt.date <= today && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="grid lg:grid-cols-2 gap-4 items-start">
                      {/* Left: actual duration controls/info */}
                      <div>
                        {apt.status === 'confirmed' ? (
                          recordingId === apt.id ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="text-sm text-slate-600 font-medium">
                                Actual visit (min):
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={120}
                                value={actualMinutes}
                                onChange={(e) =>
                                  setActualMinutes(e.target.value)
                                }
                                className="input-field w-24"
                              />
                              <button
                                type="button"
                                onClick={() => handleRecordVisit(apt)}
                                className="btn-primary text-sm"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRecordingId(null)
                                  setActualMinutes('')
                                }}
                                className="btn-secondary text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setRecordingId(apt.id)
                                setActualMinutes(
                                  String(apt.bookedDurationMinutes || 30),
                                )
                              }}
                              className="btn-secondary text-sm"
                            >
                              Record visit
                            </button>
                          )
                        ) : (
                          apt.actualDurationMinutes != null && (
                            <p className="text-sm text-slate-500 font-medium mt-0">
                              Actual: {apt.actualDurationMinutes} min
                              {apt.fine > 0 && (
                                <span className="text-amber-700 font-bold">
                                  {' '}
                                  · Overtime fine: ${apt.fine}
                                </span>
                              )}
                            </p>
                          )
                        )}
                      </div>

                      <div className="flex items-start justify-end">
                        <button
                          type="button"
                          onClick={() => openNotesModal(apt)}
                          className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                          <StickyNote className="w-4 h-4" />
                          Log Visit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isNotesModalOpen && notesModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeNotesModal}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-xl shadow-blue-900/20 ring-1 ring-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.35em] mb-2">
                  Log visit
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {notesModalApt.patientName || 'Patient'}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {notesModalApt.chamberName ?? 'Facility'} · {notesModalApt.date} at{' '}
                  {notesModalApt.slotTime}
                </p>
              </div>

              <button
                type="button"
                onClick={closeNotesModal}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-100"
              >
                Close
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-blue-700" />
                  <p className="section-kicker mb-0">Clinical notes</p>
                </div>

                <button
                  type="button"
                  className="text-xs font-bold text-blue-700 uppercase tracking-widest hover:text-blue-800 transition-colors inline-flex items-center gap-2"
                  onClick={() => setIsReviewHistoryOpen((v) => !v)}
                >
                  <History className="w-4 h-4" />
                  {isReviewHistoryOpen ? 'Hide history' : 'Review history'}
                </button>
              </div>

              <textarea
                rows={4}
                value={
                  notesDraftByAptId[notesModalApt.id] ??
                  notesModalApt.doctorNotes ??
                  ''
                }
                onChange={(e) =>
                  setNotesDraftByAptId((prev) => ({
                    ...prev,
                    [notesModalApt.id]: e.target.value,
                  }))
                }
                placeholder="Write what happened during the visit: symptoms, assessment, plan..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleSaveNotes(notesModalApt)}
                  className="btn-primary text-sm"
                >
                  Save notes
                </button>
                <p className="text-xs text-slate-400 font-medium">
                  {notesModalApt.doctorNotesUpdatedAt
                    ? `Last updated: ${new Date(
                        notesModalApt.doctorNotesUpdatedAt,
                      ).toLocaleString()}`
                    : 'Notes will be attached to this visit.'}
                </p>
              </div>

              {isReviewHistoryOpen && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  {(() => {
                    const history = getDoctorNotesHistory(
                      doctor.id,
                      notesModalApt.patientId,
                    ).filter((x) => x.id !== notesModalApt.id)

                    return history.length === 0 ? (
                      <div className="text-sm text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          No previous notes for this patient.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <History className="w-4 h-4" />
                          Previous notes
                        </div>
                        {history.slice(0, 5).map((h) => (
                          <div
                            key={h.id}
                            className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="text-sm font-bold text-slate-900">
                                {h.date} · {h.slotTime}
                              </p>
                              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                Visit
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">
                              {h.doctorNotes}
                            </p>
                          </div>
                        ))}
                        {history.length > 5 && (
                          <p className="text-xs text-slate-400 font-medium">
                            Showing latest 5 entries.
                          </p>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
