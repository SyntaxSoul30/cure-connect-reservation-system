import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const AdminToggleInput = ({ value, onChange, placeholder }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input 
        type={visible ? "text" : "password"} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field border-slate-200 w-full pr-10 focus:ring-slate-500 focus:border-slate-500" 
        required 
      />
      <button 
        type="button" 
        onClick={() => setVisible(!visible)} 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@cureconnect.com')) {
      setError("This portal is restricted to CureConnect staff only.");
      return;
    }

    try {
        const result = await login(email, password, 'admin');
        
        console.log("Login Attempt Result:", result);

        if (result && result.user && result.user.role.toLowerCase() === 'admin') {
          navigate('/admin');
        } else if (result && result.error) {
          setError(result.error); 
        } else {
          setError("Access Denied: You do not have administrative privileges.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        setError("An unexpected error occurred. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm border-t-8 border-slate-800">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-100 p-5 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-slate-800" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Gateway</h1>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold text-center">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Administrator Email
            </label>
            <input 
              type="email" 
              placeholder="Enter your admin email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="input-field border-slate-200 w-full focus:ring-slate-500 focus:border-slate-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <AdminToggleInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold border border-red-100 animate-in fade-in slide-in-from-top-1">
              <ShieldAlert size={16} className="shrink-0" /> 
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 mt-2 active:scale-[0.98]"
          >
            Verify & Enter
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-300 text-[9px] uppercase tracking-widest font-medium">
            System Identity: CureConnect-Admin-v1
          </p>
        </div>
      </div>
    </div>
  );
}