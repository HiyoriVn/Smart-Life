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
import {
  Plus,
  GripVertical,
  Trash2,
  Calendar,
  Flag,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";
const HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001";

const COLUMNS = [
  {
    id: "todo",
    label: "To Do",
    icon: <Circle size={16} />,
    headerClass: "bg-slate-100 border-slate-300 text-slate-700",
    bodyClass: "bg-slate-50/60",
    dotClass: "bg-slate-400",
    badgeClass: "bg-slate-200 text-slate-600",
  },
  {
    id: "in_progress",
    label: "In Progress",
    icon: <Loader2 size={16} className="animate-spin" />,
    headerClass: "bg-blue-50 border-blue-200 text-blue-800",
    bodyClass: "bg-blue-50/40",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "done",
    label: "Done",
    icon: <CheckCircle2 size={16} />,
    headerClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
    bodyClass: "bg-emerald-50/40",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
];

const PRIORITY_CONFIG = {
  high: {
    cls: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    label: "Cao",
  },
  medium: {
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "Trung bình",
  },
  low: {
    cls: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    label: "Thấp",
  },
};

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onDelete, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const priority =
    PRIORITY_CONFIG[task.priority?.toLowerCase()] ?? PRIORITY_CONFIG.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm select-none
        transition-all duration-150
        ${overlay ? "shadow-2xl rotate-1 scale-[1.03] ring-2 ring-blue-400 border-blue-300" : "hover:shadow-md hover:border-gray-300"}
        ${isDragging && !overlay ? "opacity-30 scale-95" : ""}
      `}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical size={15} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug mb-1.5 truncate">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {task.priority && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${priority.cls}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
            )}
            {task.deadline && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Calendar size={11} />
                {new Date(task.deadline).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        {!overlay && (
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 text-gray-300 hover:text-red-500 transition-all"
            title="Xóa task"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Droppable Column ─────────────────────────────────────────────────────────
function KanbanColumn({ column, tasks, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col flex-1 min-w-60 max-w-xs">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-t-xl border ${column.headerClass} mb-0`}
      >
        <div className="flex items-center gap-2 font-semibold text-sm">
          {column.icon}
          {column.label}
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.badgeClass}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-96 rounded-b-xl p-3 flex flex-col gap-2.5
          border border-t-0 transition-all duration-200
          ${column.bodyClass}
          ${isOver ? "ring-2 ring-blue-400 ring-inset bg-blue-50/60 border-blue-200" : "border-gray-200"}
        `}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}
        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2 py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <ClipboardList size={28} strokeWidth={1.2} />
            <p className="text-xs">Thả task vào đây</p>
          </div>
        )}
        {isOver && (
          <div className="h-16 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/60 flex items-center justify-center text-blue-400 text-xs">
            Thả vào đây
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
    deadline: new Date().toISOString().split("T")[0],
    priority: "medium",
    status: "todo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" /> Thêm Task mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Tên công việc *
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="VD: Ôn tập Toán Giải tích chương 3"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mô tả
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Chi tiết thêm (tùy chọn)"
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Mức độ ưu tiên
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                <option value="low">🟢 Thấp</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="high">🔴 Cao</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Deadline *
              </label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Đang tạo...
                </>
              ) : (
                <>
                  <Plus size={14} /> Tạo Task
                </>
              )}
            </button>
          </div>
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
  const [updatingId, setUpdatingId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  // ── Fetch tasks ──
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Không thể tải danh sách task");
      setTasks(json.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ── Group tasks ──
  const byColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  // ── Drag handlers ──
  const handleDragStart = ({ active }) =>
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const newStatus = over.id;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.status === newStatus) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );
    setUpdatingId(task.id);

    try {
      const res = await fetch(`${API_BASE}/tasks/${task.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("API error");
    } catch {
      // Rollback về trạng thái cũ
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Delete task ──
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa task này?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    } catch {
      // Silent fail – đã xóa khỏi UI
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 gap-3">
        <Loader2 size={28} className="animate-spin text-blue-500" />
        <span className="text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 flex-col gap-3 text-red-500">
        <AlertCircle size={36} strokeWidth={1.5} />
        <p className="font-semibold">{error}</p>
        <p className="text-sm text-gray-400">
          Kiểm tra Backend đang chạy ở localhost:5000
        </p>
        <button
          onClick={fetchTasks}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-1"
        >
          <RefreshCw size={14} /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Flag size={20} className="text-blue-600" /> Kanban Board
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kéo thả task giữa các cột để cập nhật tiến độ
            {updatingId && (
              <span className="ml-2 text-blue-500 text-xs animate-pulse">
                • Đang lưu...
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTasks}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-xl text-sm transition-colors"
          >
            <RefreshCw size={14} /> Làm mới
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
          >
            <Plus size={16} /> Thêm Task
          </button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={byColumn[col.id]}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onDelete={() => {}} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdded={(t) => setTasks((prev) => [t, ...prev])}
        />
      )}
    </div>
  );
}
