import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, ShieldAlert, Eye, EyeOff, Mail } from 'lucide-react';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password, 'doctor');
    if (result && result.user && result.user.role === 'doctor') {
      navigate('/doctor');
    } else {
      setError("Unauthorized: Doctor credentials required.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/50 via-blue-600 to-blue-800" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px]" />


      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-md border border-white/20 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-50 p-5 rounded-3xl mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Provider Portal</h1>
          <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold text-center">
            Secure Practitioner Gateway
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Professional Email</label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="input-field border-slate-200 w-full py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                type={visible ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-field border-slate-200 w-full pr-10 py-3.5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setVisible(!visible)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold border border-red-100 flex items-center gap-2">
              <ShieldAlert size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50">
          <div className="flex items-start gap-4 group">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Mail size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Need assistance with your account or interested in joining our provider network? 
              </p>
              <a 
                href="mailto:support@cureconnect.com" 
                className="text-blue-600 font-bold text-[11px] hover:underline block mt-1"
              >
                support@cureconnect.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-white/40 text-[9px] font-medium tracking-[0.3em] uppercase">
        Secured by CureConnect Encryption
      </p>
    </div>
  );
}