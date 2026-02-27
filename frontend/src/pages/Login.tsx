import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Calendar, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';

export function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-6 transition-colors duration-300",
      theme === 'dark' ? "bg-[#0f172a]" : "bg-slate-50"
    )}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]",
          theme === 'dark' ? "bg-indigo-600" : "bg-indigo-200"
        )} />
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]",
          theme === 'dark' ? "bg-blue-600" : "bg-blue-200"
        )} />
      </div>

      <div className={cn(
        "w-full max-w-md p-10 rounded-[32px] border shadow-2xl relative z-10 backdrop-blur-sm",
        theme === 'dark' ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      )}>
        <div className="flex flex-col items-center mb-10">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6 border",
            theme === 'dark' ? "bg-slate-800 border-slate-700 text-indigo-500" : "bg-indigo-50 border-indigo-100 text-indigo-600"
          )}>
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className={cn("text-3xl font-bold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Welcome Back</h1>
          <p className="text-slate-500 text-sm font-medium">Sign in to continue your productivity journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={cn("text-xs font-bold uppercase tracking-widest ml-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Email Address</label>
            <div className="relative group">
              <div className={cn(
                "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                theme === 'dark' ? "text-slate-500 group-focus-within:text-indigo-500" : "text-slate-400 group-focus-within:text-indigo-600"
              )}>
                <Mail className="w-5 h-5" />
              </div>
              <input 
                required
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none text-sm font-medium",
                  theme === 'dark' 
                    ? "bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                )}
                placeholder="name@company.com" 
                type="email" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className={cn("text-xs font-bold uppercase tracking-widest", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <div className={cn(
                "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                theme === 'dark' ? "text-slate-500 group-focus-within:text-indigo-500" : "text-slate-400 group-focus-within:text-indigo-600"
              )}>
                <Lock className="w-5 h-5" />
              </div>
              <input 
                required
                className={cn(
                  "w-full pl-12 pr-12 py-4 rounded-2xl border transition-all outline-none text-sm font-medium",
                  theme === 'dark' 
                    ? "bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                )}
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-1">
            <input 
              id="remember" 
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-transparent" 
              type="checkbox" 
            />
            <label htmlFor="remember" className="text-xs font-semibold text-slate-500 cursor-pointer">Remember me for 30 days</label>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-1 h-px bg-slate-800/50"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or continue with</span>
          <div className="flex-1 h-px bg-slate-800/50"></div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4">
          <button className={cn(
            "flex items-center justify-center space-x-3 py-3.5 rounded-2xl border font-bold text-sm transition-all hover:shadow-md",
            theme === 'dark' ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}>
            <img alt="Google" className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
            <span>Google</span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link to="/signup" className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
