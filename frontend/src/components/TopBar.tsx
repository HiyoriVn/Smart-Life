import { Search, Sun, Moon, Bell, Plus } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { setIsTaskModalOpen } = useApp();

  return (
    <header className={cn(
      "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-4">
        <div className={cn(
          "hidden md:flex items-center border rounded-xl px-4 py-2.5 w-72 transition-all focus-within:ring-2 shadow-sm",
          theme === 'dark' 
            ? "bg-slate-800 border-slate-700 focus-within:border-indigo-500/50 focus-within:ring-indigo-500/10" 
            : "bg-white border-slate-200 focus-within:border-indigo-500/50 focus-within:ring-indigo-500/10"
        )}>
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-300 placeholder-slate-500" 
            placeholder="Search for tasks, events..." 
            type="text" 
          />
        </div>
        <button 
          onClick={toggleTheme}
          className={cn(
            "p-2.5 rounded-xl border transition-all active:scale-95 shadow-sm",
            theme === 'dark' 
              ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700" 
              : "bg-white border-slate-200 text-slate-500 hover:text-orange-500 hover:bg-orange-50"
          )}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className={cn(
          "p-2.5 rounded-xl border relative transition-all active:scale-95 shadow-sm",
          theme === 'dark' 
            ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700" 
            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
        </button>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className={cn(
            "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-md shadow-indigo-900/20"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
