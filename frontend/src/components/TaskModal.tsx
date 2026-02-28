import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { ClassItem } from '../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TaskModal() {
  const { theme } = useTheme();
  const { state, isTaskModalOpen, setIsTaskModalOpen, addClass } = useApp();
  
  const [formData, setFormData] = useState<Omit<ClassItem, 'id'>>({
    name: '',
    day: new Date().getDay(),
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    teacher: '',
    color: '#6366f1',
    isAuto: false
  });

  if (!isTaskModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    if (toMinutes(formData.endTime) <= toMinutes(formData.startTime)) {
      alert("Giờ kết thúc phải sau giờ bắt đầu!");
      return;
    }

    const hasConflict = state.classes.some(c => {
      if (c.isAuto) return false;
      if (c.day !== formData.day) return false;
      const startMin = toMinutes(formData.startTime);
      const endMin = toMinutes(formData.endTime);
      const cStart = toMinutes(c.startTime);
      const cEnd = toMinutes(c.endTime);
      return startMin < cEnd && endMin > cStart;
    });

    if (hasConflict) {
      alert("Trùng lịch trên Schedule!");
      return;
    }

    addClass(formData);
    
    setIsTaskModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      day: new Date().getDay(),
      startTime: '09:00',
      endTime: '10:00',
      room: '',
      teacher: '',
      color: '#6366f1',
      isAuto: false
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTaskModalOpen(false)}></div>
      <div className={cn(
        "relative w-full max-w-md rounded-3xl shadow-2xl border p-8 animate-in zoom-in-95 duration-200",
        theme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-800"
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create New Task</h2>
          <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Name</label>
            <input 
              required
              autoFocus
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className={cn(
                "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
              )} 
              placeholder="e.g. Study Session"
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
                placeholder="e.g. Home"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Teacher/Note</label>
              <input 
                value={formData.teacher}
                onChange={e => setFormData({...formData, teacher: e.target.value})}
                className={cn(
                  "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                  theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                )}
                placeholder="e.g. Self-study"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Add to Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
