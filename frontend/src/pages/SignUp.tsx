import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Calendar, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

export function SignUp() {
  const { theme } = useTheme();
  const { signup, toast } = useApp();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: weak, 1: medium, 2: strong

  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (pass.length >= 8) {
      const hasLetters = /[a-zA-Z]/.test(pass);
      const hasNumbers = /[0-9]/.test(pass);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
      
      if (hasLetters && hasNumbers && hasSpecial) {
        strength = 2; // Strong
      } else if (hasLetters || hasNumbers) {
        strength = 1; // Medium
      }
    } else {
      strength = 0; // Weak
    }
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'fullName') {
      if (value.length < 2) error = 'Tên tối thiểu 2 ký tự';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Email không hợp lệ';
    } else if (name === 'password') {
      if (value.length < 8) error = 'Mật khẩu tối thiểu 8 ký tự';
    } else if (name === 'confirmPassword') {
      if (value !== formData.password) error = 'Mật khẩu không khớp';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (formData.password !== formData.confirmPassword) {
      toast('Mật khẩu không khớp', 'error');
      return;
    }
    if (!formData.agreeTerms) return;

    try {
      await signup(formData.fullName, formData.email, formData.password);
      setTimeout(() => {
        navigate('/login', { state: { email: formData.email } });
      }, 1500);
    } catch (err: any) {
      toast(err.message, 'error');
    }
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
          <h1 className={cn("text-3xl font-bold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Create Account</h1>
          <p className="text-slate-500 text-sm font-medium">Start your productivity journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className={cn("text-xs font-bold uppercase tracking-widest ml-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Full Name</label>
            <div className="relative group">
              <div className={cn(
                "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                theme === 'dark' ? "text-slate-500 group-focus-within:text-indigo-500" : "text-slate-400 group-focus-within:text-indigo-600"
              )}>
                <User className="w-5 h-5" />
              </div>
              <input 
                required
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none text-sm font-medium",
                  theme === 'dark' 
                    ? "bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                  errors.fullName && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                )}
                placeholder="Alex Johnson" 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                onBlur={(e) => validateField('fullName', e.target.value)}
              />
            </div>
            {errors.fullName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.fullName}</p>}
          </div>

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
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                  errors.email && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                )}
                placeholder="name@company.com" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={(e) => validateField('email', e.target.value)}
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className={cn("text-xs font-bold uppercase tracking-widest ml-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Password</label>
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
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                  errors.password && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                )}
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={(e) => validateField('password', e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="h-1 w-full bg-slate-200 rounded-full mt-1 overflow-hidden flex">
              <div className={cn(
                "h-full transition-all duration-500",
                passwordStrength === 0 ? "w-1/3 bg-rose-500" : 
                passwordStrength === 1 ? "w-2/3 bg-amber-500" : "w-full bg-emerald-500"
              )} />
            </div>
            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password}</p>}
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
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                  errors.confirmPassword && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                )}
                placeholder="••••••••" 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
              />
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center space-x-2 ml-1 py-2">
            <input 
              id="terms" 
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-transparent" 
              type="checkbox" 
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            />
            <label htmlFor="terms" className="text-xs font-semibold text-slate-500 cursor-pointer">
              I agree to the <span className="text-indigo-500">Terms of Service</span> and <span className="text-indigo-500">Privacy Policy</span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={!formData.agreeTerms}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 group",
              formData.agreeTerms 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30" 
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            )}
            title={!formData.agreeTerms ? "Vui lòng đồng ý điều khoản" : ""}
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-1 h-px bg-slate-800/50"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or sign up with</span>
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
          Already have an account? <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
