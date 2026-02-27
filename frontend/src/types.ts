export type TaskStatus = 'todo' | 'planning' | 'progress' | 'review' | 'done' | 'cancelled';
export type Priority = 'high' | 'medium' | 'low';
export type Category = 'study' | 'work' | 'personal';

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  priority: Priority;
  category: Category;
  deadline: string; // ISO datetime string
  duration: number; // minutes
  note: string;
  order: number;
}

export interface ClassItem {
  id: number;
  name: string;
  day: number; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  room: string;
  teacher: string;
  color: string;
  isAuto: boolean;
  dateStr?: string; // "YYYY-MM-DD", used for auto-scheduled items
}

export interface StudyItem {
  subject: string;
  minsPerSession: number;
  color: string;
  topics: string[];
}

export interface ScoreHistoryEntry {
  date: string; // "YYYY-MM-DD"
  score: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // hashed with btoa
  avatar: string;
  createdAt: string;
  theme: 'light' | 'dark';
}

export interface Session {
  userId: string;
  email: string;
  fullName: string;
  loginAt: string;
  expiresAt: string;
}

export interface AppState {
  tasks: Task[];
  classes: ClassItem[];
  studyItems: StudyItem[];
  scoreHistory: ScoreHistoryEntry[];
  autoResult: any[]; // Result of auto-scheduling
  unscheduledCount: number;
  dateRange: {
    currentWeekStart: string; // ISO string
    currentWeekEnd: string;   // ISO string
  };
  currentUser: User | null;
  session: Session | null;
}
