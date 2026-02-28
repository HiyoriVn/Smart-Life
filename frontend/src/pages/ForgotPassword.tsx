import { useState, FormEvent, useEffect, useRef, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { User } from '../types';

export function ForgotPassword() {
  const { theme } = useTheme();
  const { resetPassword, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem('slsUsers') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
      toast('Email chưa được đăng ký', 'error');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep(2);
    setTimer(300);
    toast(`Mã xác nhận của bạn: ${code}`, 'info');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (timer === 0) {
      toast('Mã đã hết hạn', 'error');
      return;
    }

    if (otp.join('') === generatedOtp) {
      setStep(3);
    } else {
      toast('Mã xác nhận không đúng', 'error');
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast('Mật khẩu tối thiểu 8 ký tự', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('Mật khẩu không khớp', 'error');
      return;
    }

    try {
      await resetPassword(email, newPassword);
      setTimeout(() => {
        navigate('/login', { state: { email } });
      }, 1500);
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <div className="flex flex-col items-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6 border",
            theme === 'dark' ? "bg-slate-800 border-slate-700 text-indigo-500" : "bg-indigo-50 border-indigo-100 text-indigo-600"
          )}>
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className={cn("text-3xl font-bold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Reset Password</h1>
          
          <div className="flex items-center justify-center space-x-4 mt-6 w-full">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              )}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-500">Email</span>
            </div>
            <div className={cn("h-px w-12 mb-4", step > 1 ? "bg-indigo-600" : "bg-slate-200")} />
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              )}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-500">OTP</span>
            </div>
            <div className={cn("h-px w-12 mb-4", step > 2 ? "bg-indigo-600" : "bg-slate-200")} />
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= 3 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              )}>
                3
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-500">New</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-slate-500 text-sm">Nhập mã xác nhận 6 số đã được gửi.</p>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-indigo-500 text-xs font-bold">Mã xác nhận của bạn: {generatedOtp}</p>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpRefs.current[idx] = el}
                  type="text"
                  maxLength={1}
                  className={cn(
                    "w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all",
                    theme === 'dark' 
                      ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  )}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                />
              ))}
            </div>
            <div className="text-center">
              <p className={cn("text-xs font-bold", timer === 0 ? "text-rose-500" : "text-slate-500")}>
                {timer === 0 ? "Mã đã hết hạn" : `Mã hết hạn sau: ${formatTime(timer)}`}
              </p>
              {timer === 0 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-indigo-500 text-xs font-bold mt-2 hover:underline"
                >
                  Gửi lại mã
                </button>
              )}
            </div>
            <button 
              type="submit"
              disabled={otp.some(d => !d) || timer === 0}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98]",
                otp.every(d => d) && timer > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              )}
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={cn("text-xs font-bold uppercase tracking-widest ml-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>New Password</label>
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              <div className="space-y-2">
                <label className={cn("text-xs font-bold uppercase tracking-widest ml-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Confirm Password</label>
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
                      "w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none text-sm font-medium",
                      theme === 'dark' 
                        ? "bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    )}
                    placeholder="••••••••" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              Reset Password
            </button>
          </form>
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
