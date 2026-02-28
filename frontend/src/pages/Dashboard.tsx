import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Timer,
  Rocket,
  Plus,
  LayoutDashboard,
  Calendar,
  Zap
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { TimeRangeNav } from '../components/TimeRangeNav';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../AppContext';
import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { theme } = useTheme();
  const { state, setIsTaskModalOpen } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekStart = useMemo(() => new Date(state.dateRange.currentWeekStart), [state.dateRange.currentWeekStart]);
  const weekEnd = useMemo(() => new Date(state.dateRange.currentWeekEnd), [state.dateRange.currentWeekEnd]);

  const weekTasks = useMemo(() => {
    return state.tasks.filter(t => {
      const dl = new Date(t.deadline);
      return dl >= weekStart && dl <= weekEnd;
    });
  }, [state.tasks, weekStart, weekEnd]);

  const stats = useMemo(() => {
    const totalTasks = weekTasks.length;
    const doneTasks = weekTasks.filter(t => t.status === 'done').length;
    const pendingTasks = weekTasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').length;
    const overdueTasks = weekTasks.filter(t => {
      if (t.status === 'done') return false;
      return new Date(t.deadline).getTime() < currentTime.getTime();
    }).length;

    const completePct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    const productScore = Math.max(0, Math.min(100,
      50 + completePct * 0.3 - overdueTasks * 10 + (doneTasks > 2 ? 15 : 0)
    ));

    return [
      { 
        label: 'Productivity', 
        value: `${productScore}%`, 
        change: completePct > 50 ? '+12% increase' : 'Keep it up!', 
        isUp: completePct > 50, 
        icon: CheckCircle2, 
        color: 'text-indigo-500', 
        bg: 'bg-indigo-500/10' 
      },
      { 
        label: 'Active Tasks', 
        value: pendingTasks.toString(), 
        change: `Across ${new Set(weekTasks.map(t => t.category)).size} categories`, 
        isUp: null, 
        icon: LayoutDashboard, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/10' 
      },
      { 
        label: 'Deadlines', 
        value: overdueTasks.toString(), 
        change: overdueTasks > 0 ? 'Action required' : 'All clear', 
        isUp: overdueTasks === 0, 
        icon: Clock, 
        color: 'text-orange-500', 
        bg: 'bg-orange-500/10' 
      },
      { 
        label: 'Completion', 
        value: `${completePct}%`, 
        change: `${doneTasks} of ${totalTasks} done`, 
        isUp: completePct > 70, 
        icon: Timer, 
        color: 'text-pink-500', 
        bg: 'bg-pink-500/10' 
      },
    ];
  }, [weekTasks, currentTime]);

  const alerts = useMemo(() => {
    const overdueTasks = weekTasks.filter(t => t.status !== 'done' && new Date(t.deadline).getTime() < currentTime.getTime()).length;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayDeadlines = weekTasks.filter(t => {
      if (t.status === 'done') return false;
      const d = new Date(t.deadline);
      return d.getTime() >= currentTime.getTime() && d.getTime() <= today.getTime();
    }).length;

    if (overdueTasks > 0) return { type: 'error', message: `⚠️ ${overdueTasks} tasks overdue!` };
    if (todayDeadlines > 0) return { type: 'warning', message: `🔥 ${todayDeadlines} deadlines today!` };
    return { type: 'success', message: "✅ Everything is on track! 💪" };
  }, [weekTasks, currentTime]);

  const todaySchedule = useMemo(() => {
    const day = currentTime.getDay();
    const dateStr = currentTime.toISOString().split('T')[0];
    const fixed = state.classes.filter(c => !c.isAuto && c.day === day);
    const auto = state.classes.filter(c => c.isAuto && c.dateStr === dateStr);
    return [...fixed, ...auto].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [state.classes, currentTime]);

  const chartData = useMemo(() => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return days.map((day, i) => {
      const jsDay = (i + 1) % 7;
      const tasksDone = weekTasks.filter(t => {
        if (t.status !== 'done') return false;
        const d = new Date(t.deadline);
        return d.getDay() === jsDay;
      }).length;
      return { name: day, value: tasksDone * 20, last: 40 };
    });
  }, [weekTasks]);

  return (
    <div className="space-y-10">
      <TopBar 
        title="Welcome back, Alex!" 
        subtitle="Here's your productivity overview for today." 
      />

      <TimeRangeNav />

      {/* Alert Bar */}
      <div className={cn(
        "p-4 rounded-2xl border flex items-center justify-between shadow-sm",
        alerts.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
        alerts.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
      )}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold text-sm">{alerts.message}</span>
        </div>
      </div>

      {weekTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-500/5 rounded-3xl border border-dashed border-slate-500/20">
          <p className="text-slate-500 font-medium">📭 Không có dữ liệu trong tuần này</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className={cn(
                  "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group shadow-sm",
                  theme === 'dark' 
                    ? "bg-slate-800/50 border-slate-700/60 hover:border-indigo-500/50" 
                    : "bg-white border-slate-100 hover:border-indigo-500/30"
                )}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className={cn("w-16 h-16", stat.color)} />
                </div>
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-400 text-sm">{stat.label}</h3>
                  </div>
                  <div>
                    <div className={cn("text-3xl font-bold mb-1", theme === 'dark' ? "text-white" : "text-slate-800")}>{stat.value}</div>
                    <div className={cn(
                      "flex items-center text-xs font-medium px-2 py-0.5 rounded-md w-fit border",
                      stat.isUp === true ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : 
                      stat.isUp === false ? "text-rose-500 bg-rose-500/10 border-rose-500/20" :
                      "text-slate-400 bg-slate-500/10 border-slate-500/20"
                    )}>
                      {stat.isUp === true && <TrendingUp className="w-3 h-3 mr-1" />}
                      {stat.isUp === false && <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <section className={cn(
                "rounded-3xl p-8 border shadow-sm",
                theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>Today's Schedule</h2>
                  </div>
                  <Link to="/schedule" className="text-xs font-bold text-indigo-500 hover:underline">View Full Calendar</Link>
                </div>
                
                <div className="space-y-4">
                  {todaySchedule.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm italic">No classes or study blocks scheduled for today.</div>
                  ) : (
                    todaySchedule.map((item) => (
                      <div key={item.id} className={cn(
                        "flex items-start p-4 rounded-2xl border transition-all relative overflow-hidden group",
                        theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"
                      )}>
                        <div className="absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ backgroundColor: item.color }}></div>
                        <div className="w-16 pt-1">
                          <span className="text-sm font-bold text-slate-400">{item.startTime}</span>
                        </div>
                        <div className="flex-1 pl-2">
                          <div className="flex items-center space-x-2">
                            <h4 className={cn("font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>{item.name}</h4>
                            {item.isAuto && <Zap className="w-3 h-3 text-indigo-500" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{item.room} • {item.teacher}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className={cn(
                "rounded-3xl p-8 border shadow-sm",
                theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>Productivity Trends</h2>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                          borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                          borderRadius: '12px',
                          color: theme === 'dark' ? '#ffffff' : '#1e293b'
                        }}
                      />
                      <Bar dataKey="last" fill={theme === 'dark' ? '#334155' : '#e2e8f0'} radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className={cn(
                "rounded-3xl p-6 border shadow-sm",
                theme === 'dark' ? "bg-slate-800/50 border-slate-700/60" : "bg-white border-slate-100"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-slate-800")}>Upcoming Deadlines</h2>
                  <button 
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-600/20 p-2 rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {weekTasks.filter(t => t.status !== 'done').sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5).map((task) => {
                    const diff = new Date(task.deadline).getTime() - currentTime.getTime();
                    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    const color = daysLeft <= 1 ? 'text-rose-500' : daysLeft <= 3 ? 'text-amber-500' : 'text-emerald-500';
                    
                    return (
                      <div key={task.id} className={cn(
                        "group p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3",
                        theme === 'dark' ? "bg-slate-800 border-slate-700 hover:border-indigo-500/50" : "bg-slate-50 border-slate-200 hover:border-indigo-500/30"
                      )}>
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center text-white transition-all border-slate-600 group-hover:border-indigo-500 group-hover:bg-indigo-500"
                        )}>
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-semibold", theme === 'dark' ? "text-white" : "text-slate-800")}>{task.name}</p>
                          <p className={cn("text-[10px] font-bold uppercase tracking-wider mt-0.5", color)}>
                            {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `In ${daysLeft} days`} • {task.category}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {weekTasks.filter(t => t.status !== 'done').length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-xs italic">No upcoming deadlines.</div>
                  )}
                </div>
                <Link to="/kanban" className="block w-full mt-6 py-3 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-600 rounded-xl hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all">
                  View All {weekTasks.filter(t => t.status !== 'done').length} Pending Tasks
                </Link>
              </section>

              <section className="bg-gradient-to-br from-[#4f46e5] to-[#312e81] rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden border border-indigo-500/30">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Rocket className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4 border border-white/10">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold mb-1">AI Assistant</h2>
                  <p className="text-indigo-200 text-xs mb-6 max-w-[80%]">Need help organizing your study plan? Let AI do the heavy lifting.</p>
                  <Link to="/auto-scheduler" className="block w-full py-3 bg-white text-center text-indigo-600 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors">
                    Try Auto Scheduler
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
