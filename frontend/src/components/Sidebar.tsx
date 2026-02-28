import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Columns, 
  Calendar, 
  Zap, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../ThemeContext';
import { useApp } from '../AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Columns, label: 'Board Kanban', path: '/kanban' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Zap, label: 'Auto Scheduler', path: '/auto-scheduler' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export function Sidebar() {
  const location = useLocation();
  const { theme } = useTheme();
  const { state, logout } = useApp();
  const user = state.currentUser;

  if (!user) return null;

  return (
    <aside className={cn(
      "w-72 flex-shrink-0 border-r flex flex-col z-20 transition-colors",
      theme === 'dark' ? "bg-[#111827] border-gray-800" : "bg-[#F8FAFC] border-slate-200"
    )}>
      <div className="p-8 flex items-center space-x-3 mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-colors",
          theme === 'dark' ? "bg-slate-800/80 text-blue-500 border-slate-700/50" : "bg-white text-blue-600 border-slate-200"
        )}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h1 className={cn("text-lg font-bold tracking-tight leading-tight", theme === 'dark' ? "text-white" : "text-slate-800")}>Smart Life</h1>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Scheduler</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
                isActive 
                  ? (theme === 'dark' 
                      ? "bg-slate-800/50 border border-blue-500/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                      : "bg-white border border-blue-100 text-blue-700 shadow-sm")
                  : (theme === 'dark'
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm hover:border-slate-100 border border-transparent")
              )}
            >
              {isActive && theme === 'dark' && <div className="absolute inset-0 bg-blue-500/10 opacity-50" />}
              {isActive && theme === 'light' && <div className="absolute inset-0 bg-blue-50 opacity-50" />}
              
              <div className={cn(
                "relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                isActive 
                  ? (theme === 'dark' ? "bg-blue-600/30 text-blue-400" : "bg-blue-100 text-blue-600")
                  : (theme === 'dark' ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-600")
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="relative font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <div className={cn(
          "p-4 rounded-2xl border transition-colors",
          theme === 'dark' ? "bg-slate-800/40 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm",
                theme === 'dark' ? "border-slate-600 bg-slate-700 text-white" : "border-slate-200 bg-indigo-100 text-indigo-600"
              )}>
                {user.avatar}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={cn("text-sm font-bold truncate", theme === 'dark' ? "text-white" : "text-slate-800")}>{user.fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className={cn(
              "py-2.5 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 border",
              theme === 'dark' 
                ? "text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white border-slate-600/50" 
                : "text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-slate-200"
            )}>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={logout}
              className={cn(
                "py-2.5 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 border",
                theme === 'dark' 
                  ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20" 
                  : "text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
