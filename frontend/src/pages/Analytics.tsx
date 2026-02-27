import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TopBar } from '../components/TopBar';
import { TimeRangeNav } from '../components/TimeRangeNav';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award
} from 'lucide-react';
import { useApp } from '../AppContext';
import { useMemo } from 'react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Analytics() {
  const { theme } = useTheme();
  const { state } = useApp();

  const weekStart = useMemo(() => new Date(state.dateRange.currentWeekStart), [state.dateRange.currentWeekStart]);
  const weekEnd = useMemo(() => new Date(state.dateRange.currentWeekEnd), [state.dateRange.currentWeekEnd]);

  const weekTasks = useMemo(() => {
    return state.tasks.filter(t => {
      const dl = new Date(t.deadline);
      return dl >= weekStart && dl <= weekEnd;
    });
  }, [state.tasks, weekStart, weekEnd]);

  const weeklyActivityData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const jsDay = (i + 1) % 7;
      const tasksDone = weekTasks.filter(t => {
        if (t.status !== 'done') return false;
        const d = new Date(t.deadline);
        return d.getDay() === jsDay;
      }).length;
      
      const studyMins = state.classes.filter(c => {
        if (c.isAuto && c.dateStr) {
          const d = new Date(c.dateStr);
          return d >= weekStart && d <= weekEnd && d.getDay() === jsDay;
        }
        return !c.isAuto && c.day === jsDay;
      }).reduce((acc, curr) => {
        const [sh, sm] = curr.startTime.split(':').map(Number);
        const [eh, em] = curr.endTime.split(':').map(Number);
        return acc + (eh * 60 + em) - (sh * 60 + sm);
      }, 0);

      return {
        name: day,
        study: Math.round(studyMins / 60 * 10) / 10,
        tasks: tasksDone
      };
    });
  }, [weekTasks, state.classes, weekStart, weekEnd]);

  const timeAllocationData = useMemo(() => {
    const categories = ['study', 'work', 'personal'];
    return categories.map(cat => {
      const mins = weekTasks.filter(t => t.category === cat).reduce((acc, t) => acc + t.duration, 0);
      return { name: cat.charAt(0).toUpperCase() + cat.slice(1), value: mins || 10 }; // Fallback for visual
    });
  }, [weekTasks]);

  const productivityTrendData = useMemo(() => {
    if (state.scoreHistory.length > 0) {
      return state.scoreHistory.map(h => ({ name: h.date, score: h.score }));
    }
    // Placeholder if empty
    return [
      { name: 'Day 1', score: 0 },
      { name: 'Day 2', score: 0 },
      { name: 'Day 3', score: 0 },
      { name: 'Day 4', score: 0 },
      { name: 'Day 5', score: 0 },
      { name: 'Day 6', score: 0 },
      { name: 'Day 7', score: 0 },
    ];
  }, [state.scoreHistory]);

  const subjectMasteryData = useMemo(() => {
    if (state.studyItems.length === 0) return [];
    return state.studyItems.map(item => {
      const completed = weekTasks.filter(t => t.category === 'study' && t.name.toLowerCase().includes(item.subject.toLowerCase()) && t.status === 'done').length;
      const total = weekTasks.filter(t => t.category === 'study' && t.name.toLowerCase().includes(item.subject.toLowerCase())).length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      return {
        subject: item.subject,
        progress,
        remaining: 100 - progress
      };
    });
  }, [state.studyItems, weekTasks]);

  return (
    <div className="space-y-10">
      <TopBar 
        title="Performance Analytics" 
        subtitle="Functional Module 05: Data Visualization" 
      />

      <TimeRangeNav />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Productivity', value: '84%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Study Hours', value: '32.5h', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Tasks Completed', value: state.tasks.filter(t => t.status === 'done').length.toString(), icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Current Streak', value: '12 Days', icon: Award, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "p-6 rounded-2xl border shadow-sm",
            theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">This Month</span>
            </div>
            <h3 className="text-slate-400 text-xs font-bold mb-1">{stat.label}</h3>
            <p className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className={cn(
          "p-8 rounded-3xl border shadow-sm",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
        )}>
          <div className="flex items-center justify-between mb-8">
            <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>Weekly Activity</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-500">Study (h)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-500">Tasks</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="study" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={cn(
          "p-8 rounded-3xl border shadow-sm",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
        )}>
          <h2 className={cn("text-xl font-bold mb-8", theme === 'dark' ? "text-white" : "text-slate-800")}>Time Allocation</h2>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {timeAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-4">
              {timeAllocationData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs font-bold text-slate-500">{entry.name}</span>
                  </div>
                  <span className={cn("text-xs font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>{entry.value}m</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(
          "p-8 rounded-3xl border shadow-sm",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
        )}>
          <h2 className={cn("text-xl font-bold mb-8", theme === 'dark' ? "text-white" : "text-slate-800")}>Productivity Trend</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={cn(
          "p-8 rounded-3xl border shadow-sm",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
        )}>
          <h2 className={cn("text-xl font-bold mb-8", theme === 'dark' ? "text-white" : "text-slate-800")}>Subject Mastery</h2>
          <div className="space-y-6">
            {subjectMasteryData.length === 0 ? (
              <div className="text-center py-10 text-slate-500 italic text-sm">No subjects defined. Add study items to track progress.</div>
            ) : (
              subjectMasteryData.map((item, i) => (
                <div key={item.subject}>
                  <div className="flex justify-between mb-2">
                    <span className={cn("text-sm font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>{item.subject}</span>
                    <span className="text-xs font-bold text-indigo-500">{item.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
