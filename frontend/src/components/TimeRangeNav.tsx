import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { formatDateRange, getStartOfWeek } from '../lib/dateUtils';

export function TimeRangeNav({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();
  const { state, prevWeek, nextWeek, goToday } = useApp();

  const start = new Date(state.dateRange.currentWeekStart);
  const end = new Date(state.dateRange.currentWeekEnd);
  const label = formatDateRange(start, end);

  const todayStart = getStartOfWeek(new Date());
  const isCurrentWeek = start.toDateString() === todayStart.toDateString();

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex p-1 rounded-xl border", 
          theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <button 
            onClick={prevWeek}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-4 py-1 text-sm font-bold" id="date-range-label">
            {label}
          </button>
          <button 
            onClick={nextWeek}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button 
          id="btn-today"
          onClick={goToday}
          disabled={isCurrentWeek}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95",
            theme === 'dark' 
              ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-40" 
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 disabled:opacity-40"
          )}
        >
          Today
        </button>
      </div>
      {children}
    </div>
  );
}
