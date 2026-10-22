import { useState } from 'react'
import { UserCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile } from '../../services/api'
import PageShell from '../../components/PageShell'
import { writeCardOnFile } from '../../utils/cardOnFile'
import { writeDisplayProfile } from '../../utils/displayProfile'

export default function PatientProfileEdit() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
    preferredCity: user?.preferredCity || 'Arlington',
    creditCardNumber: user?.creditCardNumber || '',
    cardholderName: user?.cardholderName || '',
    expirationDate: user?.expirationDate || '',
    billingZip: user?.billingZip || '',
    cvv: user?.cvv || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const cardDigits = String(formData.creditCardNumber || '').replace(/\D/g, '')
      const cardChanged =
        (formData.creditCardNumber || '') !== (user?.creditCardNumber || '') ||
        (formData.cardholderName || '') !== (user?.cardholderName || '') ||
        (formData.expirationDate || '') !== (user?.expirationDate || '') ||
        (formData.cvv || '') !== (user?.cvv || '')
      let updatedUser = { ...user, ...formData, role: user.role }
      if (cardDigits.length >= 13 && cardDigits.length <= 19) {
        const lastFour = cardDigits.slice(-4)
        writeCardOnFile(user.email, {
          lastFour,
          cardholderName: formData.cardholderName || '',
        })
        updatedUser = {
          ...updatedUser,
          cardLastFour: lastFour,
          hasSavedCard: true,
        }
      }
      if (user.id) {
        await updateUserProfile(user.id, updatedUser)
      }
      writeDisplayProfile(user.email, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      setUser({
        ...updatedUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim() || updatedUser.name,
      })
      setIsEditing(false)
      setMessage({
        type: 'success',
        text:
          cardChanged && formData.creditCardNumber
            ? 'Profile updated successfully. Credit card information has been saved.'
            : 'Profile updated successfully',
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Update failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell
      eyebrow="Account"
      title={isEditing ? 'Edit profile' : 'My account'}
      subtitle={
        isEditing
          ? 'Update contact preferences and saved payment details securely.'
          : 'Your verified identity and billing profile for faster check-in.'
      }
      heroSize="compact"
      contentMax="max-w-4xl"
      tone="rose"
      actions={
        !isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 bg-white text-rose-700 text-xs font-black uppercase tracking-[0.12em] px-8 py-4 rounded-2xl shadow-xl shadow-rose-900/30 hover:bg-rose-50 transition-all"
          >
            <UserCircle className="w-5 h-5" />
            Edit profile
          </button>
        ) : null
      }
    >
      {/* Feedback */}
      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center animate-in fade-in zoom-in-95 ${message.type === 'success' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      {/* 3. PROFILE CARD */}
      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm ring-1 ring-slate-100 relative">
        
        {/* BASIC INFORMATION SECTION */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Contact Information</h3>
            <div className="h-px flex-1 bg-slate-50" />
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <DataField label="First Name" name="firstName" value={formData.firstName} editing={isEditing} onChange={handleChange} />
            <DataField label="Last Name" name="lastName" value={formData.lastName} editing={isEditing} onChange={handleChange} />
            <DataField label="Email Address" name="email" value={formData.email} editing={isEditing} onChange={handleChange} type="email" />
            <DataField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} editing={isEditing} onChange={handleChange} />
            
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Preferred City</label>
              {isEditing ? (
                <select 
                  name="preferredCity" value={formData.preferredCity} onChange={handleChange}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10"
                >
                  <option value="Arlington">Arlington, VA</option>
                  <option value="Fairfax">Fairfax, VA</option>
                  <option value="Washington">Washington, D.C.</option>
                  <option value="Bethesda">Bethesda, MD</option>
                </select>
              ) : (
                <p className="px-1 text-sm font-bold text-slate-800">{formData.preferredCity}</p>
              )}
            </div>
          </div>
        </div>

        {/* PAYMENT INFORMATION SECTION */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Secure Payment</h3>
            <div className="h-px flex-1 bg-slate-50" />
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="md:col-span-2">
              <DataField label="Cardholder Full Name" name="cardholderName" value={formData.cardholderName} editing={isEditing} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <DataField 
                label="Card Number" name="creditCardNumber" 
                value={
                  isEditing
                    ? formData.creditCardNumber
                    : formData.creditCardNumber
                      ? `•••• •••• •••• ${String(formData.creditCardNumber).replace(/\D/g, '').slice(-4)}`
                      : user?.cardLastFour
                        ? `•••• •••• •••• ${user.cardLastFour}`
                        : '—'
                }
                editing={isEditing} onChange={handleChange} 
              />
            </div>
            <DataField label="Expiry (MM/YY)" name="expirationDate" value={formData.expirationDate} editing={isEditing} onChange={handleChange} />
            <DataField label="CVV" name="cvv" value={formData.cvv} editing={isEditing} onChange={handleChange} type="password" />
          </div>
        </div>

        {/* EDIT MODE ACTIONS */}
        {isEditing && (
          <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-end gap-6">
            <button 
              type="button" onClick={() => setIsEditing(false)}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit" disabled={submitting}
              className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-rose-100"
            >
              {submitting ? 'Updating...' : 'Save Profile'}
            </button>
          </div>
        )}
      </form>
    </PageShell>
  )
}

/** * Reusable Component: DataField
 * Automatically switches between static text and an input field
 */
function DataField({ label, value, editing, name, onChange, type = "text", placeholder }) {
  return (
    <div className="flex flex-col animate-in fade-in duration-200">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
        {label}
      </label>
      {editing ? (
        <input 
          name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300"
        />
      ) : (
        <p className="px-1 text-sm font-bold text-slate-800">
          {type === 'password' ? '••••' : (value || '—')}
        </p>
      )}
    </div>
  )
}