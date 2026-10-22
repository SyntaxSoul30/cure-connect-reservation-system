import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const roleHint = location.state?.roleHint || 'patient'
  const [formData, setFormData] = useState({ email: '', password: '', role: roleHint })
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: roleHint }))
  }, [roleHint])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(formData.email, formData.password, formData.role)
    if (result.error) {
      setError(result.error)
    } else {
      navigate(formData.role === 'admin' ? '/admin' : `/${formData.role}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#047857] flex flex-col items-center justify-center p-4 relative overflow-hidden">      
      {/* Updated Gradient: Emerald Tones */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/40 via-[#047857] to-[#065F46]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px]" />
      
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em] relative z-10"
      >
        <ArrowLeft size={14} /> Return to Main Site
      </button>

      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-md border border-white/20 relative z-10">
        <div className="text-center mb-10">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-[#047857] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patient Sign In</h1>
          <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">Secure Health Access</p>
        </div>

        {location.state?.registered && (
          <div className="mb-6 text-emerald-800 text-[11px] font-bold text-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            Account created. Sign in with your email and password to continue.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              name="email" type="email" placeholder="Enter your email" onChange={handleChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#047857] transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                name="password" type={visible ? "text" : "password"} placeholder="Enter your password" onChange={handleChange} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#047857] transition-all" 
                required 
              />
              <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#047857] transition-colors">
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-[11px] font-bold text-center bg-red-50 p-4 rounded-2xl border border-red-100">{error}</div>}

          <button 
            type="submit" 
            className="w-full bg-[#047857] hover:bg-[#065F46] text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98]"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-sm">New here? <Link to="/register" className="text-[#047857] font-bold hover:underline">Create Account</Link></p>
        </div>
      </div>
    </div>
  )
}