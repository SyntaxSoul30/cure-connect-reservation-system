import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  getDoctorById, 
  getChamberById, 
  getFacilityById, 
  getBookedSlotsForChamberDate, 
  createAppointment, 
  updateUserProfile 
} from '../../services/api'
import { CalendarClock } from 'lucide-react'
import { chamberTimeSlots } from '../../services/slots'
import { getNextDates, dateToDayId, APPOINTMENT_DURATIONS } from '../../data/constants'
import { useAuth } from '../../context/AuthContext'
import PageShell, { PageBackLink } from '../../components/PageShell'

function cardLastFourFromUser(user) {
  if (!user) return ''
  if (user.cardLastFour) return String(user.cardLastFour).slice(-4)
  if (user.creditCardNumber) {
    const d = String(user.creditCardNumber).replace(/\D/g, '')
    return d.slice(-4) || String(user.creditCardNumber).slice(-4)
  }
  return ''
}

function userHasOnFileCard(user) {
  return Boolean(cardLastFourFromUser(user))
}

export default function BookAppointment() {
  const { doctorId, chamberId } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [durationMinutes, setDurationMinutes] = useState(30)
  
  // Full payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardholderName: '', creditCardNumber: '', expirationDate: '', cvv: '', billingZip: ''
  })
  const [paymentError, setPaymentError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const doctor = useMemo(() => getDoctorById(doctorId), [doctorId])
  const chamber = useMemo(() => getChamberById(chamberId), [chamberId])
  const facility = useMemo(() => {
    if (!chamber) return null;
    return getFacilityById(chamber.facilityId || chamber.clinicId);
  }, [chamber])

  const dates = useMemo(() => getNextDates(14) || [], [])

  const availableDates = useMemo(() => {
    if (!chamber?.availableDays) return []
    return dates.map(d => ({
      date: d,
      isAvailable: (chamber.availableDays || []).includes(dateToDayId(d))
    }))
  }, [chamber, dates])

  const bookedSlots = selectedDate ? (getBookedSlotsForChamberDate(chamberId, selectedDate) || []) : []
  
  const allSlots = useMemo(() => {
    if (!chamber?.slotStart || !chamber?.slotEnd) return [];
    return chamberTimeSlots(chamber.slotStart, chamber.slotEnd, durationMinutes) || [];
  }, [chamber, durationMinutes])

  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

  if (!doctor || !chamber || !facility) return null;

  // Handle typing in the payment form
  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
    setPaymentError('')
  }

  const onFileLastFour = userHasOnFileCard(user) ? cardLastFourFromUser(user) : ''

  // Saved card on file, or new card being entered in the form
  const hasPaymentInfo =
    userHasOnFileCard(user) || paymentForm.creditCardNumber.trim().length > 0

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !user) return
    
    setPaymentError('')
    let finalCardNumber = user.creditCardNumber || null

    // If they don't have a saved card, validate the new form
    if (!userHasOnFileCard(user) && paymentForm.creditCardNumber.trim().length > 0) {
      
      // 1. Check for empty fields
      if (!paymentForm.cardholderName || !paymentForm.expirationDate || !paymentForm.cvv || !paymentForm.billingZip) {
        setPaymentError('Please fill out all payment fields.');
        return;
      }

      // 2. Validate the 16 digits
      const strippedCard = paymentForm.creditCardNumber.replace(/\D/g, ''); 
      if (strippedCard.length !== 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return; 
      }
      
      finalCardNumber = strippedCard;
      
      // 3. Save all details to profile
      try {
        if (user.id) {
          const updatedUser = { ...user, ...paymentForm, creditCardNumber: finalCardNumber }
          await updateUserProfile(user.id, updatedUser)
          setUser(updatedUser)
        }
      } catch (err) {
        console.error("Failed to save new card", err);
      }
    }

    setSubmitting(true)

    const lastFour = finalCardNumber
      ? String(finalCardNumber).replace(/\D/g, '').slice(-4)
      : onFileLastFour

    const aptData = {
      patientId: user.id || `patient_${user.email}`,
      patientName: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      chamberId: chamber.id,
      chamberName: facility?.name || 'Medical Facility',
      chamberAddress: facility?.address || '',
      chamberState: facility?.state || '',
      chamberCity: facility?.city || '',
      date: selectedDate,
      slotTime: selectedSlot,
      status: 'confirmed',
      bookedDurationMinutes: durationMinutes,
      charge: chamber.consultationCharge ?? 0,
      paymentMethod: lastFour ? `Card ending in ${lastFour}` : 'Card linked to account',
    }

    createAppointment(aptData)
    setSubmitting(false)
    navigate('/patient/booking-success', { state: { appointment: aptData } })
  }

  return (
    <PageShell
      eyebrow="Booking"
      title="Reserve your slot"
      subtitle={`With ${doctor?.name} · ${facility?.name || 'Choose a time that fits your day.'}`}
      heroSize="compact"
      tone="rose"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <CalendarClock className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to={`/patient/doctors/${doctorId}`}>Back to specialist</PageBackLink>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Select Date</h2>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Available Dates Highlighted</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {availableDates.map(({ date, isAvailable }) => {
                const dObj = new Date(date + 'T12:00:00');
                const isSelected = selectedDate === date;
                
                return (
                  <button
                    key={date}
                    disabled={!isAvailable}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-24
                      ${!isAvailable ? 'bg-slate-50 border-slate-50 opacity-30 cursor-not-allowed' : 'bg-white hover:border-rose-500'}
                      ${isSelected ? 'border-rose-600 ring-2 ring-rose-600/10 shadow-lg' : 'border-slate-100'}
                    `}
                  >
                    <span className={`text-[10px] font-black uppercase mb-1 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`}>
                      {dObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-xl font-bold ${isSelected ? 'text-rose-700' : 'text-slate-900'}`}>
                      {dObj.getDate()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">
                      {dObj.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedDate ? (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                2. Available Slots for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h2>
              {availableSlots.length === 0 ? (
                <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 border-dashed">
                  <p className="text-sm font-bold text-slate-400 italic">This date is fully booked.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${selectedSlot === slot ? 'bg-rose-700 border-rose-700 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-sm font-bold text-slate-400 italic">Please select a date from the calendar to view available times.</p>
            </div>
          )}

          <section className="pt-10 border-t border-slate-100 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 text-center">Duration</h2>
              <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl">
                {(APPOINTMENT_DURATIONS || [30]).map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${durationMinutes === mins ? 'bg-white text-rose-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details Section */}
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 text-center">
                Payment Details {userHasOnFileCard(user) ? '' : '(Required)'}
              </h2>
              
              {userHasOnFileCard(user) ? (
                
                /* BADGE: Shown if they already have a card saved */
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Card linked to account</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">•••• {cardLastFourFromUser(user)}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>

              ) : (

                /* FULL FORM: Shown if they need to add one */
                <div className="relative animate-in fade-in duration-300">
                  <div className="grid grid-cols-3 gap-3">
                    <input name="cardholderName" value={paymentForm.cardholderName} onChange={handlePaymentChange} type="text" placeholder="Name on Card" className="col-span-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300" />
                    
                    <input name="creditCardNumber" value={paymentForm.creditCardNumber} onChange={handlePaymentChange} type="text" maxLength="19" placeholder="16-digit Card Number" className={`col-span-3 bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 ${paymentError && paymentForm.creditCardNumber.replace(/\D/g, '').length !== 16 && paymentForm.creditCardNumber.length > 0 ? 'border-red-300 focus:ring-2 focus:ring-red-500/10' : 'border-slate-100 focus:ring-2 focus:ring-rose-500/10'}`} />
                    
                    <input name="expirationDate" value={paymentForm.expirationDate} onChange={handlePaymentChange} type="text" placeholder="MM/YY" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300" />
                    <input name="cvv" value={paymentForm.cvv} onChange={handlePaymentChange} type="text" placeholder="CVV" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300" />
                    <input name="billingZip" value={paymentForm.billingZip} onChange={handlePaymentChange} type="text" placeholder="Zip" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300" />
                  </div>
                  
                  {paymentError && (
                    <p className="absolute -bottom-6 left-1 text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                      {paymentError}
                    </p>
                  )}
                </div>

              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:shadow-rose-900/[0.06] transition-all duration-500">
            <h2 className="text-lg font-bold text-slate-900 mb-8 text-center">Consultation Summary</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-300 uppercase">Provider</span>
                <span className="text-sm font-bold text-slate-900">{doctor?.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-300 uppercase">Location</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{facility?.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{facility?.city}, {facility?.state}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                <span className="text-xs font-bold text-slate-300 uppercase">Total Fee</span>
                <span className="text-xl font-black text-rose-700">${chamber?.consultationCharge ?? 0}</span>
              </div>
            </div>

            {selectedDate && selectedSlot ? (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8 text-center animate-in zoom-in-95">
                <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-2">Selected Time</p>
                <p className="font-bold text-rose-900 text-lg">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedSlot}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-6 mb-8 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Awaiting selection...</p>
              </div>
            )}

            <button 
              onClick={handleBook} 
              disabled={submitting || !selectedDate || !selectedSlot || !hasPaymentInfo} 
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4.5 rounded-[1.25rem] font-bold transition-all shadow-xl shadow-rose-100 disabled:opacity-20 disabled:shadow-none"
            >
              {submitting ? 'Creating Record...' : 'Confirm Consultation'}
            </button>

            {!hasPaymentInfo && selectedDate && selectedSlot && (
               <p className="mt-3 text-[10px] text-red-500 font-bold text-center uppercase tracking-widest animate-pulse">
                 * Payment details required to book
               </p>
            )}

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
                 Notice: Cancellation within 24 hours results in a <span className="text-slate-900 font-bold">$50 fee</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}