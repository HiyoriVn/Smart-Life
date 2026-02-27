import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin, 
  X,
  Trash2,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { TimeRangeNav } from '../components/TimeRangeNav';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';
import { ClassItem } from '../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 to 22:00

export function Schedule() {
  const { theme } = useTheme();
  const { state, addClass, updateClass, deleteClass } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  const weekStart = useMemo(() => new Date(state.dateRange.currentWeekStart), [state.dateRange.currentWeekStart]);
  const weekEnd = useMemo(() => new Date(state.dateRange.currentWeekEnd), [state.dateRange.currentWeekEnd]);

  const weekClasses = useMemo(() => {
    return state.classes.filter(c => {
      if (c.isAuto && c.dateStr) {
        const d = new Date(c.dateStr);
        return d >= weekStart && d <= weekEnd;
      }
      return !c.isAuto; // Fixed classes are always shown
    });
  }, [state.classes, weekStart, weekEnd]);
  const [formData, setFormData] = useState<Partial<ClassItem>>({
    name: '',
    day: 1,
    startTime: '08:00',
    endTime: '09:00',
    room: '',
    teacher: '',
    color: '#6366f1',
    isAuto: false
  });

  const openAddModal = (day?: number, time?: string) => {
    setEditingClass(null);
    setFormData({
      name: '',
      day: day ?? 1,
      startTime: time ?? '08:00',
      endTime: time ? `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` : '09:00',
      room: '',
      teacher: '',
      color: '#6366f1',
      isAuto: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ClassItem) => {
    setEditingClass(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: ClassItem } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, item: ClassItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const duplicateClass = (item: ClassItem) => {
    const startMin = toMinutes(item.startTime);
    const endMin = toMinutes(item.endTime);
    const duration = endMin - startMin;
    
    const newStartMin = startMin + 15;
    const newEndMin = newStartMin + duration;
    
    const newStart = toTimeString(newStartMin);
    const newEnd = toTimeString(newEndMin);
    
    if (checkConflict(item.day, newStart, newEnd)) {
      alert("⚠️ Trùng lịch khi nhân đôi!");
      return;
    }
    
    const { id, ...rest } = item;
    addClass({ ...rest, startTime: newStart, endTime: newEnd });
    setContextMenu(null);
  };

  const moveDay = (item: ClassItem) => {
    const nextDay = (item.day + 1) % 7;
    if (checkConflict(nextDay, item.startTime, item.endTime, item.id)) {
      alert("⚠️ Trùng lịch khi chuyển ngày!");
      return;
    }
    updateClass(item.id, { day: nextDay });
    setContextMenu(null);
  };

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  const [resizing, setResizing] = useState<{ id: number; startY: number; origEndMin: number; origStartMin: number } | null>(null);

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const toTimeString = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const checkConflict = (newDay: number, newStart: string, newEnd: string, excludeId?: number) => {
    const startMin = toMinutes(newStart);
    const endMin = toMinutes(newEnd);
    
    return state.classes.some(c => {
      if (c.id === excludeId || c.isAuto) return false;
      if (c.day !== newDay) return false;
      
      const cStart = toMinutes(c.startTime);
      const cEnd = toMinutes(c.endTime);
      
      return startMin < cEnd && endMin > cStart;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert("Nhập tên môn học!");
      return;
    }

    if (toMinutes(formData.endTime!) <= toMinutes(formData.startTime!)) {
      alert("Giờ kết thúc phải sau giờ bắt đầu!");
      return;
    }

    if (checkConflict(formData.day!, formData.startTime!, formData.endTime!, editingClass?.id)) {
      alert("Trùng lịch!");
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, formData as Partial<ClassItem>);
    } else {
      addClass(formData as Omit<ClassItem, 'id'>);
    }
    setIsModalOpen(false);
  };

  const onDragStart = (e: React.DragEvent, id: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('classId', id.toString());
    e.dataTransfer.setData('offsetY', offsetY.toString());
  };

  const onDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('classId'));
    const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));
    const item = state.classes.find(c => c.id === id);
    if (!item) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top - offsetY;
    
    const ROW_HEIGHT = 80;
    const GRID_START = 7;
    const SNAP_MINUTES = 15;

    let rawMin = (y / ROW_HEIGHT) * 60 + GRID_START * 60;
    let newStartMin = Math.round(rawMin / SNAP_MINUTES) * SNAP_MINUTES;
    newStartMin = Math.max(GRID_START * 60, Math.min(newStartMin, 22 * 60 - 15));
    
    const duration = toMinutes(item.endTime) - toMinutes(item.startTime);
    const newEndMin = Math.min(newStartMin + duration, 22 * 60);
    
    const newStartTime = toTimeString(newStartMin);
    const newEndTime = toTimeString(newEndMin);

    if (checkConflict(dayIndex, newStartTime, newEndTime, id)) {
      alert("⚠️ Trùng lịch!");
      return;
    }

    updateClass(id, { day: dayIndex, startTime: newStartTime, endTime: newEndTime });
  };

  const onResizeStart = (e: React.MouseEvent, item: ClassItem) => {
    e.stopPropagation();
    setResizing({
      id: item.id,
      startY: e.clientY,
      origEndMin: toMinutes(item.endTime),
      origStartMin: toMinutes(item.startTime)
    });
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      
      const ROW_HEIGHT = 80;
      const SNAP_MINUTES = 15;
      
      const deltaY = e.clientY - resizing.startY;
      const deltaMin = Math.round((deltaY / ROW_HEIGHT) * 60 / SNAP_MINUTES) * SNAP_MINUTES;
      
      let newEndMin = resizing.origEndMin + deltaMin;
      newEndMin = Math.max(resizing.origStartMin + 15, Math.min(newEndMin, 22 * 60));
      
      const item = state.classes.find(c => c.id === resizing.id);
      if (!item) return;

      // Update UI immediately for smoothness
      const block = document.querySelector(`[data-class-id="${resizing.id}"]`) as HTMLElement;
      if (block) {
        const newHeight = ((newEndMin - resizing.origStartMin) / 60) * ROW_HEIGHT - 2;
        block.style.height = `${newHeight}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!resizing) return;
      
      const ROW_HEIGHT = 80;
      const SNAP_MINUTES = 15;
      
      const deltaY = e.clientY - resizing.startY;
      const deltaMin = Math.round((deltaY / ROW_HEIGHT) * 60 / SNAP_MINUTES) * SNAP_MINUTES;
      
      let newEndMin = resizing.origEndMin + deltaMin;
      newEndMin = Math.max(resizing.origStartMin + 15, Math.min(newEndMin, 22 * 60));
      
      const item = state.classes.find(c => c.id === resizing.id);
      if (item) {
        const newEndTime = toTimeString(newEndMin);
        if (checkConflict(item.day, item.startTime, newEndTime, item.id)) {
          alert("⚠️ Thời lượng mới trùng lịch!");
        } else {
          updateClass(item.id, { endTime: newEndTime });
        }
      }
      
      setResizing(null);
    };

    if (resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  const getPosition = (time: string) => {
    const totalMins = toMinutes(time) - 7 * 60;
    return (totalMins / 60) * 80; // 80px per hour
  };

  const getDurationHeight = (start: string, end: string) => {
    const diff = toMinutes(end) - toMinutes(start);
    return (diff / 60) * 80;
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar 
        title="Weekly Schedule" 
        subtitle="Functional Module 03: Schedule Management" 
      />

      <TimeRangeNav>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => openAddModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </TimeRangeNav>

      <div className="flex-1 overflow-auto border rounded-3xl shadow-sm relative custom-scrollbar" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}>
        <div className="min-w-[1000px]">
              <div className="sticky top-0 z-30 flex border-b" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0' }}>
                <div className="w-20 flex-shrink-0"></div>
                {DAYS.map((day, i) => {
                  const dayDate = new Date(weekStart);
                  dayDate.setDate(weekStart.getDate() + i);
                  const isToday = new Date().toDateString() === dayDate.toDateString();
                  return (
                    <div key={day} className={cn(
                      "flex-1 py-4 text-center border-l transition-colors",
                      isToday && (theme === 'dark' ? "bg-indigo-500/10" : "bg-indigo-50"),
                      theme === 'dark' ? "border-slate-700" : "border-slate-200"
                    )} style={{ borderColor: theme === 'dark' ? '#334155' : '#e2e8f0' }}>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isToday ? "text-indigo-500" : "text-slate-500")}>{day.slice(0, 3)}</p>
                      <p className={cn("text-lg font-bold", isToday ? "text-indigo-500" : (theme === 'dark' ? "text-white" : "text-slate-800"))}>{dayDate.getDate()}</p>
                    </div>
                  );
                })}
              </div>

          <div className="relative flex">
            <div className="w-20 flex-shrink-0">
              {HOURS.map(hour => (
                <div key={hour} className="h-20 flex items-start justify-center pt-2">
                  <span className="text-[10px] font-bold text-slate-500">{hour}:00</span>
                </div>
              ))}
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 grid grid-cols-7">
                {DAYS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "border-l h-full relative",
                      new Date().getDay() === i && (theme === 'dark' ? "bg-indigo-500/5" : "bg-indigo-50/30")
                    )}
                    style={{ borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, i)}
                  >
                    {HOURS.map(hour => (
                      <div 
                        key={hour} 
                        className="h-20 border-b cursor-pointer hover:bg-indigo-500/5 transition-colors" 
                        style={{ borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
                        onClick={() => openAddModal(i, `${hour.toString().padStart(2, '0')}:00`)}
                      ></div>
                    ))}
                    
                    {weekClasses.filter(c => c.day === i).map(item => (
                      <div 
                        key={item.id}
                        data-class-id={item.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, item.id)}
                        onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                        onContextMenu={(e) => handleContextMenu(e, item)}
                        className={cn(
                          "absolute left-1 right-1 rounded-xl p-3 border-l-4 shadow-md cursor-grab active:cursor-grabbing transition-all hover:scale-[1.01] hover:z-20 group overflow-hidden",
                          theme === 'dark' ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-100",
                          item.isAuto && "border-dashed opacity-90"
                        )}
                        style={{ 
                          top: `${getPosition(item.startTime)}px`, 
                          height: `${getDurationHeight(item.startTime, item.endTime)}px`,
                          borderLeftColor: item.color
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={cn("text-xs font-bold truncate", theme === 'dark' ? "text-white" : "text-slate-800")}>
                            {item.isAuto && "🤖 "}{item.name}
                          </h4>
                          {item.isAuto && <Zap className="w-3 h-3 text-indigo-500" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-[10px] text-slate-400">
                            <Clock className="w-3 h-3 mr-1" /> {item.startTime} - {item.endTime}
                          </div>
                          <div className="flex items-center text-[10px] text-slate-400">
                            <MapPin className="w-3 h-3 mr-1" /> {item.room}
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                           <button onClick={(e) => { e.stopPropagation(); deleteClass(item.id); }} className="p-1 bg-rose-500 text-white rounded-md"><Trash2 className="w-3 h-3" /></button>
                        </div>

                        {/* Resize Handle */}
                        <div 
                          onMouseDown={(e) => onResizeStart(e, item)}
                          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-indigo-500/30 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className={cn(
            "relative w-full max-w-md rounded-3xl shadow-2xl border p-8 animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-800"
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Class Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={cn(
                    "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  )} 
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Day</label>
                  <select 
                    value={formData.day}
                    onChange={e => setFormData({...formData, day: parseInt(e.target.value)})}
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    )}
                  >
                    {DAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Color</label>
                  <input 
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-full h-[58px] p-1 rounded-2xl border bg-transparent cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Start Time</label>
                  <input 
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">End Time</label>
                  <input 
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Room</label>
                  <input 
                    value={formData.room}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    )}
                    placeholder="e.g. A101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Teacher</label>
                  <input 
                    value={formData.teacher}
                    onChange={e => setFormData({...formData, teacher: e.target.value})}
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    )}
                    placeholder="e.g. Dr. Smith"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {editingClass ? 'Save Changes' : 'Add to Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className={cn(
            "fixed z-[200] w-48 rounded-xl border shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-100",
            theme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-800"
          )}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { openEditModal(contextMenu.item); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-indigo-500 hover:text-white rounded-lg transition-colors flex items-center gap-2">
            <Clock className="w-4 h-4" /> Chỉnh sửa
          </button>
          <button onClick={() => duplicateClass(contextMenu.item)} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-indigo-500 hover:text-white rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nhân đôi
          </button>
          <button onClick={() => moveDay(contextMenu.item)} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-indigo-500 hover:text-white rounded-lg transition-colors flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> Chuyển ngày
          </button>
          <div className="h-px bg-slate-700/50 my-1 mx-2" />
          <button onClick={() => { deleteClass(contextMenu.item.id); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Xóa
          </button>
        </div>
      )}
    </div>
  );
}
