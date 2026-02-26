import { useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import AiScheduler from "./components/AiScheduler";
import {
  LayoutDashboard,
  BrainCircuit,
  GraduationCap,
  CalendarDays,
  Menu,
  X,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "kanban",
    label: "Kanban Board",
    sublabel: "Quản lý công việc",
    icon: LayoutDashboard,
    color: "text-blue-600",
    activeBg: "bg-blue-50 border-blue-200",
  },
  {
    id: "ai",
    label: "AI Scheduler",
    sublabel: "Xếp lịch tự động",
    icon: BrainCircuit,
    color: "text-violet-600",
    activeBg: "bg-violet-50 border-violet-200",
    badge: "AI",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab);
  const ActiveIcon = activeItem?.icon;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside
        className={`
          ${sidebarOpen ? "w-60" : "w-16"} shrink-0
          bg-white border-r border-gray-200 flex flex-col
          transition-all duration-200 ease-in-out
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow shrink-0">
            SL
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-gray-800 text-sm leading-tight whitespace-nowrap">
                Smart Life
              </p>
              <p className="text-[11px] text-gray-400 whitespace-nowrap">
                Hackathon 2026
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className={`ml-auto text-gray-400 hover:text-gray-600 ${!sidebarOpen ? "hidden" : ""}`}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Expand toggle when collapsed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mx-auto mt-3 text-gray-400 hover:text-gray-600"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left
                  transition-all duration-150 group
                  ${
                    isActive
                      ? `${item.activeBg} ${item.color}`
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isActive ? item.color : "text-gray-400"}`}
                />
                {sidebarOpen && (
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-linear-to-r from-blue-500 to-violet-600 text-white px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">
                      {item.sublabel}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                U
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  Demo User
                </p>
                <p className="text-[11px] text-gray-400">Hackathon Mode</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {ActiveIcon && (
              <ActiveIcon size={20} className={activeItem?.color} />
            )}
            <h1 className="font-bold text-gray-800 text-base">
              {activeItem?.label}
            </h1>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
            <span>Smart Life</span>
            <span>/</span>
            <span className="text-gray-600 font-medium">
              {activeItem?.label}
            </span>
          </div>

          {/* Right side of header */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap size={12} />
              Backend Online
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600 font-medium">
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                U
              </div>
              Demo User
            </div>
          </div>
        </header>

        {/* Tab quick-switch strip */}
        <div className="bg-white border-b border-gray-100 px-6 flex gap-1 shrink-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all
                  ${
                    isActive
                      ? `border-blue-600 text-blue-700`
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon size={14} />
                {item.label}
                {item.badge && (
                  <span className="bg-linear-to-r from-blue-500 to-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6 h-full">
            {activeTab === "kanban" && <KanbanBoard />}
            {activeTab === "ai" && <AiScheduler />}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-9 bg-white border-t border-gray-100 flex items-center justify-center shrink-0">
          <p className="text-xs text-gray-400">
            Smart Life © 2026 — Built with ❤️ for Hackathon
          </p>
        </footer>
      </div>
    </div>
  );
}
