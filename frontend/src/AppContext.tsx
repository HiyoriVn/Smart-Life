import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  AppState,
  Task,
  ClassItem,
  StudyItem,
  ScoreHistoryEntry,
  User,
  Session,
} from "./types";
import { getStartOfWeek, getEndOfWeek, addDays } from "./lib/dateUtils";
import { cn } from "./lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import * as taskApi from "./api/task.api";
import * as userApi from "./api/user.api";

interface Toast {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface AppContextType {
  state: AppState;
  setTasks: (tasks: Task[]) => void;
  setClasses: (classes: ClassItem[]) => void;
  setStudyItems: (items: StudyItem[]) => void;
  setAutoResult: (result: any[], unscheduledCount: number) => void;
  updateScoreHistory: (date: string, score: number) => void;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addClass: (item: Omit<ClassItem, "id">) => void;
  updateClass: (id: number, updates: Partial<ClassItem>) => void;
  deleteClass: (id: number) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  goToday: () => void;
  // Auth
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  toast: (message: string, type?: Toast["type"]) => void;
  currentToast: Toast | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  tasks: [],
  classes: [],
  studyItems: [],
  scoreHistory: [],
  autoResult: [],
  unscheduledCount: 0,
  dateRange: {
    currentWeekStart: getStartOfWeek(new Date()).toISOString(),
    currentWeekEnd: getEndOfWeek(new Date()).toISOString(),
  },
  currentUser: null,
  session: null,
};

/** No mock data — everything comes from the backend or is empty on first login. */
const DEFAULT_DATA: Partial<AppState> = {
  tasks: [],
  classes: [],
  studyItems: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  // ---- Task API helpers ----

  const loadTasks = useCallback(async () => {
    try {
      const tasks = await taskApi.getTasks();
      setState((prev) => ({ ...prev, tasks }));
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
    }
  }, []);

  // Initialize from localStorage, then hydrate tasks from backend
  useEffect(() => {
    const restore = async () => {
      const sessionStr = localStorage.getItem("slsSession");
      if (sessionStr) {
        const session: Session = JSON.parse(sessionStr);
        if (new Date(session.expiresAt) > new Date()) {
          const users: User[] = JSON.parse(
            localStorage.getItem("slsUsers") || "[]",
          );
          const user = users.find((u) => u.id === session.userId);
          if (user) {
            const userDataKey = `slsData_${user.id}`;
            const savedData = localStorage.getItem(userDataKey);
            let userState = INITIAL_STATE;
            if (savedData) {
              userState = { ...INITIAL_STATE, ...JSON.parse(savedData) };
            } else {
              userState = { ...INITIAL_STATE, ...DEFAULT_DATA };
            }
            setState({ ...userState, currentUser: user, session });
            // Load fresh tasks from backend (replaces cached tasks)
            try {
              const tasks = await taskApi.getTasks();
              setState((prev) => ({ ...prev, tasks }));
            } catch {
              // Keep cached tasks on network failure
            }
            return;
          }
        } else {
          localStorage.removeItem("slsSession");
        }
      }
      setState(INITIAL_STATE);
    };
    restore();
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.currentUser && state.session) {
      const userDataKey = `slsData_${state.currentUser.id}`;
      const { currentUser, session, ...dataToSave } = state;
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave));

      // Also sync theme to user object
      const users: User[] = JSON.parse(
        localStorage.getItem("slsUsers") || "[]",
      );
      const updatedUsers = users.map((u) =>
        u.id === state.currentUser?.id
          ? {
              ...u,
              theme: document.documentElement.classList.contains("dark")
                ? "dark"
                : "light",
            }
          : u,
      );
      localStorage.setItem("slsUsers", JSON.stringify(updatedUsers));
    }
  }, [state]);

  const toast = (message: string, type: Toast["type"] = "info") => {
    setCurrentToast({ message, type });
    setTimeout(() => setCurrentToast(null), 3000);
  };

  const login = async (email: string, password: string, remember: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate loading
    const users: User[] = JSON.parse(localStorage.getItem("slsUsers") || "[]");
    const user = users.find((u) => u.email === email);

    if (!user) throw new Error("Email chưa được đăng ký");
    if (user.password !== btoa(password))
      throw new Error("Mật khẩu không đúng");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (remember ? 30 : 7));

    const session: Session = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      loginAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    localStorage.setItem("slsSession", JSON.stringify(session));

    const userDataKey = `slsData_${user.id}`;
    const savedData = localStorage.getItem(userDataKey);
    let userState = INITIAL_STATE;
    if (savedData) {
      userState = { ...INITIAL_STATE, ...JSON.parse(savedData) };
    } else {
      userState = { ...INITIAL_STATE, ...DEFAULT_DATA };
    }

    setState({ ...userState, currentUser: user, session });
    toast(`👋 Chào mừng trở lại, ${user.fullName}!`, "success");

    // Hydrate tasks from backend
    try {
      const tasks = await taskApi.getTasks();
      setState((prev) => ({ ...prev, tasks }));
    } catch {
      // Keep cached/default tasks on network failure
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    // Check local cache first for quick duplicate detection
    const users: User[] = JSON.parse(localStorage.getItem("slsUsers") || "[]");
    if (users.some((u) => u.email === email))
      throw new Error("Email này đã được đăng ký");

    // Create user in backend — returns a real UUID
    const backendUser = await userApi.createUser({
      full_name: fullName,
      email,
      password: btoa(password),
      role: "student",
    });

    const newUser: User = {
      id: backendUser.id, // Real UUID from backend
      fullName,
      email,
      password: btoa(password),
      avatar: fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      createdAt: backendUser.created_at || new Date().toISOString(),
      theme: "light",
    };

    users.push(newUser);
    localStorage.setItem("slsUsers", JSON.stringify(users));
    toast("🎉 Đăng ký thành công! Vui lòng đăng nhập.", "success");
  };

  const logout = () => {
    localStorage.removeItem("slsSession");
    setState(INITIAL_STATE);
    toast("Đã đăng xuất", "info");
  };

  const resetPassword = async (email: string, newPassword: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("slsUsers") || "[]");
    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) throw new Error("Email không tồn tại");

    if (users[userIndex].password === btoa(newPassword)) {
      throw new Error("Mật khẩu mới không được trùng mật khẩu cũ");
    }

    users[userIndex].password = btoa(newPassword);
    localStorage.setItem("slsUsers", JSON.stringify(users));
    toast("✅ Đặt lại mật khẩu thành công!", "success");
  };

  const setTasks = (tasks: Task[]) => setState((prev) => ({ ...prev, tasks }));
  const setClasses = (classes: ClassItem[]) =>
    setState((prev) => ({ ...prev, classes }));
  const setStudyItems = (studyItems: StudyItem[]) =>
    setState((prev) => ({ ...prev, studyItems }));
  const setAutoResult = (autoResult: any[], unscheduledCount: number) =>
    setState((prev) => ({ ...prev, autoResult, unscheduledCount }));

  const updateScoreHistory = (date: string, score: number) => {
    setState((prev) => {
      const existing = prev.scoreHistory.find((h) => h.date === date);
      let newHistory;
      if (existing) {
        newHistory = prev.scoreHistory.map((h) =>
          h.date === date ? { ...h, score } : h,
        );
      } else {
        newHistory = [...prev.scoreHistory, { date, score }];
      }
      return { ...prev, scoreHistory: newHistory };
    });
  };

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const userId = state.currentUser?.id || "";
      const created = await taskApi.createTask({
        ...task,
        user_id: userId,
      });
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, created] }));
    } catch (err: any) {
      toast(err.message || "Failed to create task", "error");
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const currentTask = state.tasks.find((t) => t.id === id);
    if (!currentTask) return;

    const merged: Task = { ...currentTask, ...updates };

    // Optimistic update
    setState((prev) => {
      const newTasks = prev.tasks.map((t) => (t.id === id ? merged : t));

      // Update score history when task marked done
      let newHistory = prev.scoreHistory;
      if (updates.status === "done") {
        const date = new Date().toISOString().split("T")[0];
        const doneCount = newTasks.filter((t) => t.status === "done").length;
        const totalCount = newTasks.length;
        const score = Math.round((doneCount / totalCount) * 100);
        const existing = prev.scoreHistory.find((h) => h.date === date);
        if (existing) {
          newHistory = prev.scoreHistory.map((h) =>
            h.date === date ? { ...h, score } : h,
          );
        } else {
          newHistory = [...prev.scoreHistory, { date, score }];
        }
      }

      return { ...prev, tasks: newTasks, scoreHistory: newHistory };
    });

    // Persist to backend
    try {
      if (Object.keys(updates).length === 1 && updates.status) {
        await taskApi.updateTaskStatus(id, updates.status);
      } else {
        const { id: _id, ...payload } = merged;
        await taskApi.updateTask(id, payload);
      }
    } catch (err: any) {
      // Revert on failure
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? currentTask : t)),
      }));
      toast(err.message || "Failed to update task", "error");
    }
  };

  const deleteTask = async (id: string) => {
    const currentTask = state.tasks.find((t) => t.id === id);

    // Optimistic delete
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));

    try {
      await taskApi.deleteTask(id);
    } catch (err: any) {
      // Revert on failure
      if (currentTask) {
        setState((prev) => ({ ...prev, tasks: [...prev.tasks, currentTask] }));
      }
      toast(err.message || "Failed to delete task", "error");
    }
  };

  const addClass = (item: Omit<ClassItem, "id">) => {
    setState((prev) => {
      const id =
        prev.classes.length > 0
          ? Math.max(...prev.classes.map((c) => c.id)) + 1
          : 1;
      return { ...prev, classes: [...prev.classes, { ...item, id }] };
    });
  };

  const updateClass = (id: number, updates: Partial<ClassItem>) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    }));
  };

  const deleteClass = (id: number) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
    }));
  };

  const nextWeek = () => {
    setState((prev) => {
      const start = addDays(prev.dateRange.currentWeekStart, 7);
      const end = addDays(prev.dateRange.currentWeekEnd, 7);
      return {
        ...prev,
        dateRange: {
          currentWeekStart: start.toISOString(),
          currentWeekEnd: end.toISOString(),
        },
      };
    });
  };

  const prevWeek = () => {
    setState((prev) => {
      const start = addDays(prev.dateRange.currentWeekStart, -7);
      const end = addDays(prev.dateRange.currentWeekEnd, -7);
      return {
        ...prev,
        dateRange: {
          currentWeekStart: start.toISOString(),
          currentWeekEnd: end.toISOString(),
        },
      };
    });
  };

  const goToday = () => {
    setState((prev) => ({
      ...prev,
      dateRange: {
        currentWeekStart: getStartOfWeek(new Date()).toISOString(),
        currentWeekEnd: getEndOfWeek(new Date()).toISOString(),
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setTasks,
        setClasses,
        setStudyItems,
        setAutoResult,
        updateScoreHistory,
        loadTasks,
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
        goToday,
        login,
        signup,
        logout,
        resetPassword,
        toast,
        currentToast,
      }}
    >
      {children}

      {/* Toast Notification */}
      {currentToast && (
        <div className="fixed bottom-6 right-6 z-9999 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={cn(
              "px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-3 min-w-75 backdrop-blur-md",
              currentToast.type === "success" &&
                "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
              currentToast.type === "error" &&
                "bg-rose-500/10 border-rose-500/20 text-rose-500",
              currentToast.type === "warning" &&
                "bg-amber-500/10 border-amber-500/20 text-amber-500",
              currentToast.type === "info" &&
                "bg-blue-500/10 border-blue-500/20 text-blue-500",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentToast.type === "success" && "bg-emerald-500 text-white",
                currentToast.type === "error" && "bg-rose-500 text-white",
                currentToast.type === "warning" && "bg-amber-500 text-white",
                currentToast.type === "info" && "bg-blue-500 text-white",
              )}
            >
              {currentToast.type === "success" && (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {currentToast.type === "error" && (
                <AlertCircle className="w-5 h-5" />
              )}
              {currentToast.type === "warning" && (
                <AlertTriangle className="w-5 h-5" />
              )}
              {currentToast.type === "info" && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{currentToast.message}</p>
            </div>
            <button
              onClick={() => setCurrentToast(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
