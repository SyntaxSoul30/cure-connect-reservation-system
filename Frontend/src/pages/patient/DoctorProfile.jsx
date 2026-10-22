import { useParams, Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import { getDoctorById, getChambersByDoctorId, getFacilityById } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'
import PageShell, { PageBackLink } from '../../components/PageShell'

export default function DoctorProfile() {
  const { doctorId } = useParams()
  
  // Defensive Data Fetching
  const doctor = getDoctorById(doctorId)
  const chambers = getChambersByDoctorId(doctorId) || []

  if (!doctor) {
    return (
      <PageShell
        eyebrow="Specialist"
        title="Profile unavailable"
        subtitle="We couldn’t find this provider. Head back to search and try again."
        heroSize="compact"
        contentMax="max-w-2xl"
        tone="rose"
      >
        <PageBackLink to="/patient/doctors">Back to search</PageBackLink>
        <Link
          to="/patient/doctors"
          className="inline-flex bg-rose-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all"
        >
          Browse specialists
        </Link>
      </PageShell>
    )
  }

  const specNames = (doctor.specializationIds || [])
    .map(id => SPECIALIZATIONS.find(s => s.id === id)?.name)
    .filter(Boolean)

  return (
    <PageShell
      eyebrow="Specialist profile"
      title={doctor.name}
      subtitle={`${doctor.qualification || 'Verified provider'} · Book a slot at a facility that works for you.`}
      heroSize="compact"
      contentMax="max-w-5xl"
      tone="rose"
      actions={
        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
          <Stethoscope className="w-7 h-7 text-white opacity-95" />
        </div>
      }
    >
      <PageBackLink to="/patient/doctors">Back to results</PageBackLink>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-sm ring-1 ring-slate-100 mb-12 flex flex-col md:flex-row gap-10 items-center md:items-start hover:shadow-xl hover:shadow-rose-900/[0.05] transition-all duration-500">
        <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 text-5xl font-black shrink-0">
          {doctor.name.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <p className="text-rose-700 font-black uppercase tracking-widest text-xs">
              {doctor.qualification}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
            {specNames.map((name, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                {name}
              </span>
            ))}
          </div>

          <div className="space-y-4 max-w-2xl">
            {doctor.bio && (
              <p className="text-slate-500 leading-relaxed font-medium">{doctor.bio}</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-slate-50">
               <div>
                 <p className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Licenses</p>
                 <p className="text-xs font-bold text-slate-700">{doctor.licensedStates?.join(', ') || 'Global'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Experience</p>
                 <p className="text-xs font-bold text-slate-700">Verified Professional</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <h2 className="section-kicker mb-6 px-2">Clinical availability</h2>
        
        {chambers.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
            No active chambers found
          </div>
        ) : (
          <div className="grid gap-6">
            {chambers.map((ch) => {
              const facility = getFacilityById(ch.facilityId || ch.clinicId)
              return (
                <div key={ch.id} className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-rose-200 transition-all shadow-sm">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                       <h3 className="text-xl font-bold text-slate-900">{facility?.name ?? 'Main Facility'}</h3>
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-4">
                      {facility?.address}, {facility?.city}
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Schedule</p>
                        <p className="text-xs font-bold text-slate-700 uppercase">{ch.availableDays?.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Hours</p>
                        <p className="text-xs font-bold text-slate-700">{ch.slotStart} – {ch.slotEnd}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Consultation Fee</p>
                        <p className="text-xs font-black text-rose-700">${ch.consultationCharge ?? 0}</p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/patient/book/${doctorId}/${ch.id}`} 
                    className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md shadow-rose-100 text-center"
                  >
                    Pick a Slot
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}