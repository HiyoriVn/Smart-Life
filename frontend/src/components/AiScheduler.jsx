import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

const PRIORITY_COLORS = {
  high: "border-red-400 bg-red-50",
  medium: "border-yellow-400 bg-yellow-50",
  low: "border-green-400 bg-green-50",
};

const PRIORITY_BADGE = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const priority = item.priority?.toLowerCase() ?? "medium";
  const borderColor = PRIORITY_COLORS[priority] ?? "border-blue-400 bg-blue-50";
  const badge = PRIORITY_BADGE[priority] ?? "bg-blue-100 text-blue-700";

  return (
    <div className="flex gap-4">
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shrink-0">
          {index + 1}
        </div>
        <div className="w-0.5 bg-blue-200 flex-1 mt-1" />
      </div>

      {/* Content */}
      <div
        className={`mb-4 flex-1 rounded-xl border-l-4 p-4 shadow-sm ${borderColor}`}
      >
        <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
          <h4 className="font-semibold text-gray-800 text-sm">
            {item.title || item.task_title}
          </h4>
          {item.priority && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge}`}
            >
              {item.priority.toUpperCase()}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
          {item.start_time && (
            <span className="flex items-center gap-1">
              🕐 <strong>Bắt đầu:</strong>&nbsp;
              {new Date(item.start_time).toLocaleString("vi-VN")}
            </span>
          )}
          {item.end_time && (
            <span className="flex items-center gap-1">
              🕔 <strong>Kết thúc:</strong>&nbsp;
              {new Date(item.end_time).toLocaleString("vi-VN")}
            </span>
          )}
          {item.estimated_hours && (
            <span className="flex items-center gap-1">
              ⏱ <strong>{item.estimated_hours}h</strong>
            </span>
          )}
          {item.suggested_time && (
            <span className="flex items-center gap-1">
              📅 {item.suggested_time}
            </span>
          )}
        </div>

        {item.reason && (
          <p className="text-xs text-gray-400 italic mt-2">💡 {item.reason}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main AiScheduler ─────────────────────────────────────────────────────────
export default function AiScheduler() {
  const [availableHours, setAvailableHours] = useState(4);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");
  const [rawMessage, setRawMessage] = useState("");

  const handleAutoSchedule = async () => {
    setLoading(true);
    setError("");
    setSchedule(null);
    setRawMessage("");

    try {
      // 1. Lấy tasks To Do từ API
      const tasksRes = await fetch(`${API_BASE}/tasks?status=todo`);
      const tasksJson = await tasksRes.json();
      if (!tasksRes.ok)
        throw new Error(tasksJson.message || "Không thể lấy tasks");

      const todoTasks = tasksJson.data ?? [];
      if (todoTasks.length === 0) {
        setError('Không có task nào ở cột "To Do" để xếp lịch!');
        setLoading(false);
        return;
      }

      // 2. Gửi cho AI xếp lịch
      const aiRes = await fetch(`${API_BASE}/ai/auto-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: todoTasks,
          availableHours: Number(availableHours),
        }),
      });
      const aiJson = await aiRes.json();
      if (!aiRes.ok) throw new Error(aiJson.message || "AI trả về lỗi");

      // 3. Hiển thị kết quả (API có thể trả về array hoặc text)
      const data = aiJson.data ?? aiJson;
      if (Array.isArray(data)) {
        setSchedule(data);
      } else if (typeof data === "string") {
        setRawMessage(data);
      } else if (data?.schedule && Array.isArray(data.schedule)) {
        setSchedule(data.schedule);
      } else {
        setRawMessage(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🤖 AI Scheduler</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          AI sẽ phân tích các task và tự động sắp xếp thời khóa biểu tối ưu
        </p>
      </div>

      {/* Input card */}
      <div className="bg-linear-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl mb-6">
        <h3 className="font-bold text-lg mb-1">✨ Xếp lịch tự động</h3>
        <p className="text-blue-100 text-sm mb-5">
          Nhập số giờ rảnh mỗi ngày, AI sẽ xếp lịch học cho tất cả task "To Do"
          của bạn.
        </p>

        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-blue-100 font-medium">
              Số giờ rảnh mỗi ngày
            </label>
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 w-40">
              <button
                onClick={() => setAvailableHours((h) => Math.max(1, h - 1))}
                className="text-white text-xl font-bold w-6 h-6 flex items-center justify-center hover:text-blue-200 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-white font-bold text-xl">
                {availableHours}h
              </span>
              <button
                onClick={() => setAvailableHours((h) => Math.min(24, h + 1))}
                className="text-white text-xl font-bold w-6 h-6 flex items-center justify-center hover:text-blue-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAutoSchedule}
            disabled={loading}
            className="
              flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl
              hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg transition-all active:scale-95 text-sm
            "
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                AI đang tính toán...
              </>
            ) : (
              <>🚀 Tự động xếp lịch bằng AI ✨</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4 flex items-center gap-2">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Result: Timeline */}
      {schedule && schedule.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              📅 Thời khóa biểu đề xuất
            </h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {schedule.length} công việc
            </span>
          </div>
          <div className="pr-2">
            {schedule.map((item, i) => (
              <TimelineItem key={item.id ?? i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Result: Raw text (dự phòng khi AI trả về text thuần) */}
      {rawMessage && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            📋 Kết quả từ AI
          </h3>
          <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {rawMessage}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !schedule && !rawMessage && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
          <span className="text-6xl">🗓️</span>
          <p className="font-medium text-gray-500">Chưa có thời khóa biểu</p>
          <p className="text-sm text-center max-w-xs">
            Nhấn nút <strong>"Tự động xếp lịch bằng AI"</strong> để AI phân tích
            và đề xuất lịch học tối ưu cho bạn.
          </p>
        </div>
      )}
    </div>
  );
}
