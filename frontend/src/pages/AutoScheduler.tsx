import { TopBar } from '../components/TopBar';
import { TimeRangeNav } from '../components/TimeRangeNav';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { Zap, Play, Download, AlertTriangle, Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Task, ClassItem } from '../types';

export function AutoScheduler() {
  const { theme } = useTheme();
  const { state, setAutoResult, addClass, setClasses } = useApp();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    startHour: '08:00',
    endHour: '22:00',
    blockSize: 45,
    numDays: 7
  });

  const handleCalculate = () => {
    setLoading(true);
    
    setTimeout(() => {
      const result: any[] = [];
      const pendingTasks = state.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
      const studyItems = state.studyItems;
      
      const weekStart = new Date(state.dateRange.currentWeekStart);
      let unscheduledCount = 0;
      
      // Combine tasks and study items into a queue
      const queue = [
        ...pendingTasks.map(t => ({ name: t.name, duration: t.duration, color: '#6366f1', type: 'task' })),
        ...studyItems.flatMap(s => s.topics.map(topic => ({ name: `${s.subject}: ${topic}`, duration: s.minsPerSession, color: s.color, type: 'study' })))
      ];

      let currentDay = 0;
      let currentTimeMins = toMinutes(settings.startHour);
      const endMins = toMinutes(settings.endHour);

      queue.forEach((item) => {
        if (currentDay >= settings.numDays) {
          unscheduledCount++;
          return;
        }

        if (currentTimeMins + item.duration > endMins) {
          currentDay++;
          currentTimeMins = toMinutes(settings.startHour);
        }

        if (currentDay < settings.numDays) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + currentDay);
          const dateStr = date.toISOString().split('T')[0];

          result.push({
            id: Math.random(),
            name: item.name,
            day: date.getDay(),
            startTime: toTimeString(currentTimeMins),
            endTime: toTimeString(currentTimeMins + item.duration),
            room: 'Auto-Scheduled',
            teacher: 'AI Assistant',
            color: item.color,
            isAuto: true,
            dateStr
          });

          currentTimeMins += item.duration + 15; // 15 min break
        } else {
          unscheduledCount++;
        }
      });

      setAutoResult(result, unscheduledCount);
      setLoading(false);
    }, 1500);
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const toTimeString = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleApply = () => {
    // Only apply for the selected range of days
    const weekStart = new Date(state.dateRange.currentWeekStart);
    const endRange = new Date(weekStart);
    endRange.setDate(weekStart.getDate() + settings.numDays);
    
    // Remove existing auto blocks in the range
    const filteredClasses = state.classes.filter(c => {
      if (!c.isAuto || !c.dateStr) return true;
      const d = new Date(c.dateStr);
      return d < weekStart || d >= endRange;
    });

    const newClasses = [...filteredClasses];
    state.autoResult.forEach(item => {
      const { id, ...rest } = item;
      newClasses.push({ ...rest, id: Math.max(0, ...newClasses.map(c => c.id)) + 1 });
    });

    setClasses(newClasses);
    setAutoResult([], 0);
    
    setTimeout(() => {
      window.location.href = '/schedule';
    }, 600);
  };

  return (
    <div className="space-y-10">
      <TopBar 
        title="AI Auto Scheduler" 
        subtitle="Optimize your study and work sessions using our smart algorithm." 
      />

      <TimeRangeNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className={cn(
            "p-8 rounded-3xl border shadow-sm",
            theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
          )}>
            <h2 className={cn("text-xl font-bold mb-6", theme === 'dark' ? "text-white" : "text-slate-800")}>Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Hour</label>
                <input 
                  type="time" 
                  value={settings.startHour} 
                  onChange={e => setSettings({...settings, startHour: e.target.value})}
                  className={cn(
                    "w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  )} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Hour</label>
                <input 
                  type="time" 
                  value={settings.endHour} 
                  onChange={e => setSettings({...settings, endHour: e.target.value})}
                  className={cn(
                    "w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  )} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Block Size (mins)</label>
                <input 
                  type="number" 
                  value={settings.blockSize} 
                  onChange={e => setSettings({...settings, blockSize: parseInt(e.target.value)})}
                  min="25" max="90" 
                  className={cn(
                    "w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  )} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Number of Days</label>
                <input 
                  type="number" 
                  value={settings.numDays} 
                  onChange={e => setSettings({...settings, numDays: parseInt(e.target.value)})}
                  min="1" max="14" 
                  className={cn(
                    "w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  )} 
                />
              </div>
              <button 
                onClick={handleCalculate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
                <span>{loading ? 'Calculating...' : 'Calculate Schedule'}</span>
              </button>
            </div>
          </section>

          {state.unscheduledCount > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-500">Capacity Warning</p>
                <p className="text-xs text-amber-600/80 mt-1">{state.unscheduledCount} tasks could not be scheduled within the given time range.</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className={cn(
            "p-8 rounded-3xl border shadow-sm min-h-[500px] flex flex-col",
            theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
          )}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>Generated Result</h2>
              {state.autoResult.length > 0 && (
                <button 
                  onClick={handleApply}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Apply to Calendar</span>
                </button>
              )}
            </div>

            {state.autoResult.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                  <Zap className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className={cn("text-lg font-bold mb-2", theme === 'dark' ? "text-white" : "text-slate-800")}>No Schedule Generated</h3>
                <p className="text-slate-500 text-sm max-w-xs">Adjust your settings and click calculate to see your optimized study plan.</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {state.autoResult.map((item, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between group transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-800 hover:border-indigo-500/50" : "bg-slate-50 border-slate-200 hover:border-indigo-500/30"
                  )}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={cn("font-bold text-sm", theme === 'dark' ? "text-white" : "text-slate-800")}>{item.name}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="flex items-center text-[10px] font-bold text-slate-500">
                            <Clock className="w-3 h-3 mr-1" /> {item.dateStr} • {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500/20">Optimized</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
