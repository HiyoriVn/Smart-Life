import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const API_BASE = "http://localhost:5000/api";
const HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001"; // Hackathon shortcut — bỏ qua đăng nhập

const COLUMNS = [
  {
    id: "todo",
    label: "📋 To Do",
    headerColor: "bg-slate-200 text-slate-700",
    bodyColor: "bg-slate-50",
    countColor: "bg-slate-400",
  },
  {
    id: "in_progress",
    label: "⚡ In Progress",
    headerColor: "bg-blue-200 text-blue-800",
    bodyColor: "bg-blue-50",
    countColor: "bg-blue-400",
  },
  {
    id: "done",
    label: "✅ Done",
    headerColor: "bg-green-200 text-green-800",
    bodyColor: "bg-green-50",
    countColor: "bg-green-400",
  },
];

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700 border-red-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-green-100 text-green-700 border-green-300",
};

// ─── Draggable Task Card ──────────────────────────────────────────────────────
function TaskCard({ task, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const priorityStyle =
    PRIORITY_STYLES[task.priority?.toLowerCase()] ??
    "bg-gray-100 text-gray-600";

  const base = `
    bg-white rounded-xl border border-gray-200 p-4 shadow-sm select-none
    transition-shadow duration-150
    ${overlay ? "shadow-2xl rotate-2 scale-105 ring-2 ring-blue-400" : "hover:shadow-md cursor-grab active:cursor-grabbing"}
    ${isDragging && !overlay ? "opacity-40" : "opacity-100"}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={base}
    >
      <p className="font-semibold text-gray-800 text-sm leading-snug mb-2">
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
        {task.priority && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${priorityStyle}`}
          >
            {task.priority.toUpperCase()}
          </span>
        )}
        {task.deadline && (
          <span className="text-[11px] text-gray-400">
            📅 {new Date(task.deadline).toLocaleDateString("vi-VN")}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Droppable Column ─────────────────────────────────────────────────────────
function KanbanColumn({ column, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-full min-w-70 max-w-[320px]">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-t-xl font-bold text-sm ${column.headerColor}`}
      >
        <span>{column.label}</span>
        <span
          className={`text-white text-xs px-2 py-0.5 rounded-full ${column.countColor}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-120 rounded-b-xl p-3 flex flex-col gap-3
          transition-colors duration-200
          ${column.bodyColor}
          ${isOver ? "ring-2 ring-blue-400 ring-inset bg-blue-100/50" : ""}
        `}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            Thả task vào đây
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function AddTaskModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    status: "todo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: HARDCODED_USER_ID }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi tạo task");
      onAdded(json.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">➕ Thêm Task mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tên công việc *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mô tả (tuỳ chọn)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input
              type="date"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
          >
            {loading ? "Đang tạo..." : "Tạo Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main KanbanBoard ─────────────────────────────────────────────────────────
export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Fetch tasks từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE}/tasks`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Không thể tải tasks");
        setTasks(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Group tasks by status
  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const newStatus = over.id; // over.id là id của column droppable
    const taskId = active.id;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistic update UI
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    // Gọi API lưu trạng thái mới
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("API lỗi");
    } catch {
      // Rollback nếu lỗi
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)),
      );
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 flex-col gap-2">
        <span className="text-3xl">⚠️</span>
        <p className="font-medium">Lỗi: {error}</p>
        <p className="text-sm text-gray-400">
          Kiểm tra Backend đang chạy ở localhost:5000
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📌 Kanban Board</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kéo thả task để cập nhật tiến độ
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow transition-colors"
        >
          <span className="text-lg leading-none">+</span> Thêm Task
        </button>
      </div>

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id]}
            />
          ))}
        </div>

        {/* Ghost card khi đang kéo */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}
