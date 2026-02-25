import { useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import AiScheduler from "./components/AiScheduler";

const TABS = [
  { id: "kanban", label: "📌 Kanban Board" },
  { id: "ai", label: "🤖 AI Scheduler" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("kanban");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow">
              SL
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-800 text-sm">Smart Life</p>
              <p className="text-[11px] text-gray-400">Hackathon Demo</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                  ${
                    activeTab === tab.id
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Hardcoded user pill — skip login for Hackathon */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600 font-medium">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
              U
            </div>
            Demo User
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeTab === "kanban" && <KanbanBoard />}
        {activeTab === "ai" && <AiScheduler />}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200 bg-white">
        Smart Life © 2026 — Built with ❤️ for Hackathon
      </footer>
    </div>
  );
}
