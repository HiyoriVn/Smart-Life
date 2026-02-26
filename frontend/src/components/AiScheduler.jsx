import { useState } from "react";
import {
  Sparkles,
  Clock,
  Calendar,
  Loader2,
  AlertCircle,
  BrainCircuit,
  ListTodo,
  ChevronRight,
  Timer,
  CheckCircle,
  Hourglass,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const PRIORITY_CONFIG = {
  high: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "HIGH",
  },
  medium: {
    border: "border-l-amber-400",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    label: "MEDIUM",
  },
  low: {
    border: "border-l-green-400",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "LOW",
  },
};

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const priority =
    PRIORITY_CONFIG[(item.priority ?? "medium").toLowerCase()] ??
    PRIORITY_CONFIG.medium;

  const formatTime = (val) => {
    if (!val) return null;
    // If it's already "HH:MM" format, return as-is
    if (/^\d{1,2}:\d{2}/.test(val)) return val;
    // Otherwise try parsing as date
    try {
      return new Date(val).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return val;
    }
  };

  const startTime = formatTime(item.startTime ?? item.start_time);
  const endTime = formatTime(item.endTime ?? item.end_time);

  return (
    <div className="flex gap-4 group">
      {/* Index bubble + vertical line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
          {index + 1}
        </div>
        <div className="w-0.5 bg-linear-to-b from-blue-300 to-transparent flex-1 mt-1" />
      </div>

      {/* Card */}
      <div
        className={`mb-5 flex-1 rounded-xl border-l-4 p-4 shadow-sm ${priority.border} ${priority.bg} border border-gray-100`}
      >
        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
          <h4 className="font-semibold text-gray-800 text-sm leading-snug">
            {item.taskName ?? item.title ?? item.task_title ?? "Công việc"}
          </h4>
          {item.priority && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${priority.badge}`}
            >
              {priority.label}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 mb-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Time slots */}
        {(startTime || endTime) && (
          <div className="flex flex-wrap gap-3 mt-2">
            {startTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white/70 px-2.5 py-1 rounded-lg border border-gray-200">
                <Clock size={12} className="text-blue-500" />
                {startTime}
              </span>
            )}
            {startTime && endTime && (
              <ChevronRight size={14} className="text-gray-300 self-center" />
            )}
            {endTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white/70 px-2.5 py-1 rounded-lg border border-gray-200">
                <Timer size={12} className="text-violet-500" />
                {endTime}
              </span>
            )}
          </div>
        )}

        {item.reason && (
          <p className="text-[11px] text-gray-400 italic mt-2 leading-relaxed">
            💡 {item.reason}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Task Preview Badge ───────────────────────────────────────────────────────
function TaskBadge({ task }) {
  const priority =
    PRIORITY_CONFIG[(task.priority ?? "medium").toLowerCase()] ??
    PRIORITY_CONFIG.medium;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 bg-white shadow-xs text-xs">
      <span className={`w-2 h-2 rounded-full shrink-0 ${priority.dot}`} />
      <span className="text-gray-700 font-medium truncate max-w-45">
        {task.title}
      </span>
      {task.deadline && (
        <span className="ml-auto text-gray-400 shrink-0 flex items-center gap-1">
          <Calendar size={10} />
          {new Date(task.deadline).toLocaleDateString("vi-VN")}
        </span>
      )}
    </div>
  );
}

// ─── Main AiScheduler ─────────────────────────────────────────────────────────
export default function AiScheduler() {
  const [availableHours, setAvailableHours] = useState(4);
  const [loading, setLoading] = useState(false);
  const [todoTasks, setTodoTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [rawMessage, setRawMessage] = useState("");
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const handleAutoSchedule = async () => {
    setLoading(true);
    setError("");
    setSchedule(null);
    setRawMessage("");

    try {
      // 1. Fetch To Do tasks
      const tasksRes = await fetch(`${API_BASE}/tasks?status=todo`);
      const tasksJson = await tasksRes.json();
      if (!tasksRes.ok)
        throw new Error(tasksJson.message ?? "Không thể lấy danh sách tasks");

      const fetched = tasksJson.data ?? [];
      setTodoTasks(fetched);
      setHasFetched(true);

      if (fetched.length === 0) {
        setError(
          'Không có task nào ở cột "To Do" để xếp lịch. Hãy thêm task trước!',
        );
        return;
      }

      // 2. Call AI endpoint
      const aiRes = await fetch(`${API_BASE}/ai/auto-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: fetched,
          availableHours: Number(availableHours),
        }),
      });
      const aiJson = await aiRes.json();
      if (!aiRes.ok) throw new Error(aiJson.message ?? "AI trả về lỗi");

      // 3. Parse result
      const data = aiJson.data ?? aiJson;
      if (Array.isArray(data)) {
        setSchedule(data);
      } else if (data?.schedule && Array.isArray(data.schedule)) {
        setSchedule(data.schedule);
      } else if (typeof data === "string") {
        setRawMessage(data);
      } else {
        setRawMessage(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalEstimated = schedule?.length ?? 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="lg:w-80 shrink-0 flex flex-col gap-4">
        {/* AI Card */}
        <div className="bg-linear-to-br from-blue-600 via-violet-600 to-purple-700 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit size={22} />
            <h3 className="font-bold text-lg">AI Scheduler</h3>
          </div>
          <p className="text-blue-100 text-xs leading-relaxed mb-5">
            AI phân tích toàn bộ task và sắp xếp thời khóa biểu tối ưu, ưu tiên
            deadline và độ quan trọng.
          </p>

          {/* Hours slider */}
          <div className="mb-5">
            <label className="text-xs text-blue-100 font-semibold block mb-2">
              Số giờ rảnh mỗi ngày
            </label>
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setAvailableHours((h) => Math.max(1, h - 1))}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-lg transition-colors"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black">{availableHours}</span>
                <span className="text-blue-100 text-sm ml-1">giờ</span>
              </div>
              <button
                onClick={() => setAvailableHours((h) => Math.min(24, h + 1))}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full mt-2 accent-white"
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAutoSchedule}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              bg-white text-blue-700 font-bold px-4 py-3 rounded-xl
              hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg transition-all active:scale-95 text-sm
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> AI đang tính
                toán...
              </>
            ) : (
              <>
                <Sparkles size={16} /> ✨ Tự động xếp lịch với AI ✨
              </>
            )}
          </button>
        </div>

        {/* Stats row */}
        {hasFetched && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-blue-700">
                {todoTasks.length}
              </p>
              <p className="text-xs text-blue-500 font-medium mt-0.5">
                Task To Do
              </p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-violet-700">
                {totalEstimated}
              </p>
              <p className="text-xs text-violet-500 font-medium mt-0.5">
                Đã xếp lịch
              </p>
            </div>
          </div>
        )}

        {/* Task preview list */}
        {todoTasks.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ListTodo size={12} /> Task To Do ({todoTasks.length})
            </h4>
            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
              {todoTasks.map((t) => (
                <TaskBadge key={t.id} task={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Timeline result */}
        {schedule && schedule.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <h3 className="text-lg font-bold text-gray-800">
                  Thời khóa biểu đề xuất
                </h3>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {schedule.length} công việc
              </span>
              <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Hourglass size={11} /> {availableHours}h/ngày
              </span>
            </div>
            <div className="pr-1">
              {schedule.map((item, i) => (
                <TimelineItem key={item.id ?? i} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Raw text fallback */}
        {rawMessage && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <BrainCircuit size={18} className="text-violet-600" /> Kết quả từ
              AI
            </h3>
            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
              {rawMessage}
            </pre>
          </div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 rounded-xl border-l-4 border-gray-200 p-4 bg-gray-100">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !schedule && !rawMessage && (
          <div className="flex flex-col items-center justify-center h-full min-h-72 text-center gap-4 text-gray-400">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-50 to-violet-50 border border-gray-200 flex items-center justify-center">
              <BrainCircuit
                size={40}
                strokeWidth={1}
                className="text-blue-300"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-base">
                Chưa có thời khóa biểu
              </p>
              <p className="text-sm mt-1 max-w-sm">
                Nhấn nút{" "}
                <span className="font-bold text-blue-600">
                  ✨ Tự động xếp lịch với AI
                </span>{" "}
                để AI phân tích và đề xuất lịch học tối ưu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
