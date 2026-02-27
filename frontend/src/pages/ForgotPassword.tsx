import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';

export function ForgotPassword() {
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className={cn("text-3xl font-bold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Reset Password</h1>
          <p className="text-slate-500 text-sm font-medium text-center">Enter your email and we'll send you instructions to reset your password</p>
        </div>

        {!submitted ? (
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

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Check your email</h2>
              <p className="text-slate-500 text-sm">We've sent password reset instructions to your email address.</p>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-sm transition-all"
            >
              Resend Email
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/login" className="inline-flex items-center space-x-2 text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
