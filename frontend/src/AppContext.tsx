import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, Task, ClassItem, StudyItem, ScoreHistoryEntry } from './types';
import { getStartOfWeek, getEndOfWeek, addDays } from './lib/dateUtils';

interface AppContextType {
  state: AppState;
  setTasks: (tasks: Task[]) => void;
  setClasses: (classes: ClassItem[]) => void;
  setStudyItems: (items: StudyItem[]) => void;
  setAutoResult: (result: any[], unscheduledCount: number) => void;
  updateScoreHistory: (date: string, score: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addClass: (item: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: number, updates: Partial<ClassItem>) => void;
  deleteClass: (id: number) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  goToday: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  tasks: [
    { id: 1, name: 'Finish Project Proposal', status: 'progress', priority: 'high', category: 'work', deadline: new Date(Date.now() + 86400000).toISOString(), duration: 120, note: 'Drafting the main sections', order: 1 },
    { id: 2, name: 'Study Algorithms', status: 'todo', priority: 'medium', category: 'study', deadline: new Date(Date.now() + 172800000).toISOString(), duration: 90, note: 'Focus on sorting', order: 1 },
    { id: 3, name: 'Buy Groceries', status: 'done', priority: 'low', category: 'personal', deadline: new Date().toISOString(), duration: 30, note: '', order: 1 },
  ],
  classes: [
    { id: 1, name: 'Mathematics', day: 1, startTime: '08:00', endTime: '09:30', room: 'A101', teacher: 'Dr. Smith', color: '#6366f1', isAuto: false },
    { id: 2, name: 'Computer Science', day: 3, startTime: '10:00', endTime: '11:30', room: 'B202', teacher: 'Prof. Jones', color: '#10b981', isAuto: false },
  ],
  studyItems: [
    { subject: 'Math', minsPerSession: 45, color: '#6366f1', topics: ['Calculus', 'Linear Algebra'] },
  ],
  scoreHistory: [],
  autoResult: [],
  unscheduledCount: 0,
  dateRange: {
    currentWeekStart: getStartOfWeek(new Date()).toISOString(),
    currentWeekEnd: getEndOfWeek(new Date()).toISOString(),
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('appState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse appState', e);
      }
    }
    return INITIAL_STATE;
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const setTasks = (tasks: Task[]) => setState(prev => ({ ...prev, tasks }));
  const setClasses = (classes: ClassItem[]) => setState(prev => ({ ...prev, classes }));
  const setStudyItems = (studyItems: StudyItem[]) => setState(prev => ({ ...prev, studyItems }));
  const setAutoResult = (autoResult: any[], unscheduledCount: number) => setState(prev => ({ ...prev, autoResult, unscheduledCount }));

  const updateScoreHistory = (date: string, score: number) => {
    setState(prev => {
      const existing = prev.scoreHistory.find(h => h.date === date);
      let newHistory;
      if (existing) {
        newHistory = prev.scoreHistory.map(h => h.date === date ? { ...h, score } : h);
      } else {
        newHistory = [...prev.scoreHistory, { date, score }];
      }
      return { ...prev, scoreHistory: newHistory };
    });
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    setState(prev => {
      const id = prev.tasks.length > 0 ? Math.max(...prev.tasks.map(t => t.id)) + 1 : 1;
      return { ...prev, tasks: [...prev.tasks, { ...task, id }] };
    });
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setState(prev => {
      const newTasks = prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
      const updatedTask = newTasks.find(t => t.id === id);
      
      let newHistory = prev.scoreHistory;
      if (updates.status === 'done' && updatedTask) {
        const date = new Date().toISOString().split('T')[0];
        const doneCount = newTasks.filter(t => t.status === 'done').length;
        const totalCount = newTasks.length;
        const score = Math.round((doneCount / totalCount) * 100);
        
        const existing = prev.scoreHistory.find(h => h.date === date);
        if (existing) {
          newHistory = prev.scoreHistory.map(h => h.date === date ? { ...h, score } : h);
        } else {
          newHistory = [...prev.scoreHistory, { date, score }];
        }
      }
      
      return { ...prev, tasks: newTasks, scoreHistory: newHistory };
    });
  };

  const deleteTask = (id: number) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const addClass = (item: Omit<ClassItem, 'id'>) => {
    setState(prev => {
      const id = prev.classes.length > 0 ? Math.max(...prev.classes.map(c => c.id)) + 1 : 1;
      return { ...prev, classes: [...prev.classes, { ...item, id }] };
    });
  };

  const updateClass = (id: number, updates: Partial<ClassItem>) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteClass = (id: number) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.id !== id)
    }));
  };

  const nextWeek = () => {
    setState(prev => {
      const start = addDays(prev.dateRange.currentWeekStart, 7);
      const end = addDays(prev.dateRange.currentWeekEnd, 7);
      return {
        ...prev,
        dateRange: {
          currentWeekStart: start.toISOString(),
          currentWeekEnd: end.toISOString()
        }
      };
    });
  };

  const prevWeek = () => {
    setState(prev => {
      const start = addDays(prev.dateRange.currentWeekStart, -7);
      const end = addDays(prev.dateRange.currentWeekEnd, -7);
      return {
        ...prev,
        dateRange: {
          currentWeekStart: start.toISOString(),
          currentWeekEnd: end.toISOString()
        }
      };
    });
  };

  const goToday = () => {
    setState(prev => ({
      ...prev,
      dateRange: {
        currentWeekStart: getStartOfWeek(new Date()).toISOString(),
        currentWeekEnd: getEndOfWeek(new Date()).toISOString()
      }
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setTasks,
      setClasses,
      setStudyItems,
      setAutoResult,
      updateScoreHistory,
      addTask,
      updateTask,
      deleteTask,
      addClass,
      updateClass,
      deleteClass,
      isTaskModalOpen,
      setIsTaskModalOpen,
      nextWeek,
      prevWeek,
      goToday
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
