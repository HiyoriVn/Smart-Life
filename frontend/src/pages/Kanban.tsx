import React, { useState, useMemo } from "react";
import {
  MoreHorizontal,
  Plus,
  MessageCircle,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bolt,
  X,
  Trash2,
  Edit2,
  Timer as TimerIcon,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { useTheme } from "../ThemeContext";
import { cn } from "../lib/utils";
import { useApp } from "../AppContext";
import { Task, TaskStatus, Priority, Category } from "../types";
import { updateTaskStatus as persistTaskStatus } from "../api/task.api";

const columns: {
  id: TaskStatus;
  label: string;
  color: string;
  accent: string;
}[] = [
  {
    id: "todo",
    label: "To Do",
    color: "bg-slate-500",
    accent: "border-l-slate-500",
  },
  {
    id: "planning",
    label: "Planning",
    color: "bg-blue-500",
    accent: "border-l-blue-500",
  },
  {
    id: "progress",
    label: "In Progress",
    color: "bg-indigo-500",
    accent: "border-l-indigo-500",
  },
  {
    id: "review",
    label: "Review",
    color: "bg-amber-500",
    accent: "border-l-amber-500",
  },
  {
    id: "done",
    label: "Complete",
    color: "bg-emerald-500",
    accent: "border-l-emerald-500",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    color: "bg-rose-500",
    accent: "border-l-rose-500",
  },
];

export function Kanban() {
  const { theme } = useTheme();
  const {
    state,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
    setIsTaskModalOpen,
    toast,
  } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetCol, setDropTargetCol] = useState<TaskStatus | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<{
    col: TaskStatus;
    index: number;
  } | null>(null);

  const [formData, setFormData] = useState<Partial<Task>>({
    name: "",
    status: "todo",
    priority: "medium",
    category: "study",
    deadline: new Date().toISOString().slice(0, 16),
    duration: 60,
    note: "",
    order: 0,
  });

  const openAddModal = (status: TaskStatus = "todo") => {
    setEditingTask(null);
    setFormData({
      name: "",
      status,
      priority: "medium",
      category: "study",
      deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      duration: 60,
      note: "",
      order: state.tasks.filter((t) => t.status === status).length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      ...task,
      deadline: new Date(task.deadline).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        ...formData,
        deadline: new Date(formData.deadline!).toISOString(),
      } as Partial<Task>);
    } else {
      addTask({
        ...formData,
        deadline: new Date(formData.deadline!).toISOString(),
      } as Omit<Task, "id">);
    }
    setIsModalOpen(false);
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent, colId: TaskStatus, index: number) => {
    e.preventDefault();
    setDropTargetCol(colId);
    setDropTargetIndex({ col: colId, index });
  };

  const onDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("taskId");
    if (!id) return;

    const targetIndex =
      dropTargetIndex?.col === colId
        ? dropTargetIndex.index
        : state.tasks.filter((t) => t.status === colId).length;

    // Update status and reorder
    const otherTasks = state.tasks.filter((t) => t.id !== id);
    const colTasks = otherTasks
      .filter((t) => t.status === colId)
      .sort((a, b) => a.order - b.order);

    const movingTask = state.tasks.find((t) => t.id === id);
    if (!movingTask) return;

    const previousStatus = movingTask.status;
    colTasks.splice(targetIndex, 0, movingTask);

    // Re-assign orders for the target column
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === id) {
        return { ...t, status: colId, order: targetIndex };
      }
      if (t.status === colId) {
        const newIdx = colTasks.findIndex((ct) => ct.id === t.id);
        return { ...t, order: newIdx };
      }
      return t;
    });

    setTasks(updatedTasks);
    setDraggedTaskId(null);
    setDropTargetCol(null);
    setDropTargetIndex(null);

    // Persist status change to backend
    if (previousStatus !== colId) {
      persistTaskStatus(id, colId).catch((err) => {
        toast(err.message || "Failed to update task status", "error");
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar
        title="Project Workspace"
        subtitle="Functional Module 02: Board Kanban"
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                alt="Member"
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 hover:z-10 transition-transform hover:scale-110 shadow-sm"
                src={`https://picsum.photos/seed/${i + 10}/32/32`}
              />
            ))}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-sm",
                theme === "dark"
                  ? "border-slate-900 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "border-white bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              +5
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex p-1 rounded-lg border",
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-slate-100 border-slate-200",
            )}
          >
            <button
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                theme === "dark"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-800 shadow-sm",
              )}
            >
              Board
            </button>
            <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
              Timeline
            </button>
            <button className="px-4 py-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
              List
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div
              key={column.id}
              className={cn(
                "w-80 flex-shrink-0 flex flex-col h-full transition-colors rounded-2xl p-1",
                dropTargetCol === column.id ? "bg-indigo-500/10" : "",
              )}
              onDragOver={(e) =>
                onDragOver(
                  e,
                  column.id,
                  state.tasks.filter((t) => t.status === column.id).length,
                )
              }
              onDrop={(e) => onDrop(e, column.id)}
              onDragLeave={() => setDropTargetCol(null)}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-sm shadow-sm",
                      column.color,
                    )}
                  ></div>
                  <h3
                    className={cn(
                      "font-bold uppercase text-xs tracking-wider",
                      theme === "dark" ? "text-slate-200" : "text-slate-700",
                    )}
                  >
                    {column.label}
                  </h3>
                  <span
                    className={cn(
                      "ml-1 py-0.5 px-2 text-[10px] font-bold rounded-full",
                      theme === "dark"
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    {state.tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => openAddModal(column.id)}
                  className="text-slate-500 hover:text-indigo-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div
                className={cn(
                  "flex-1 flex flex-col gap-3 p-3 rounded-xl border shadow-inner overflow-y-auto custom-scrollbar",
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50"
                    : "bg-slate-100 border-slate-300/50",
                )}
                onDragOver={(e) =>
                  onDragOver(
                    e,
                    column.id,
                    state.tasks.filter((t) => t.status === column.id).length,
                  )
                }
                onDrop={(e) => onDrop(e, column.id)}
              >
                {state.tasks
                  .filter((t) => t.status === column.id)
                  .sort((a, b) => a.order - b.order)
                  .map((task, idx) => (
                    <React.Fragment key={task.id}>
                      {dropTargetIndex?.col === column.id &&
                        dropTargetIndex.index === idx && (
                          <div className="h-1 bg-indigo-500 rounded-full animate-pulse" />
                        )}
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, task.id)}
                        onDragOver={(e) => onDragOver(e, column.id, idx)}
                        className={cn(
                          "p-4 rounded-lg shadow-sm border border-l-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group hover:-translate-y-1 relative",
                          theme === "dark"
                            ? "bg-slate-700 border-slate-600"
                            : "bg-white border-slate-200",
                          task.priority === "high"
                            ? "border-l-rose-500"
                            : task.priority === "medium"
                              ? "border-l-blue-500"
                              : "border-l-slate-400",
                          draggedTaskId === task.id ? "opacity-40" : "",
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border",
                              task.category === "study"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : task.category === "work"
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                            )}
                          >
                            {task.category}
                          </span>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(task)}
                              className="p-1 hover:text-indigo-500 text-slate-400"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 hover:text-rose-500 text-slate-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <h4
                          className={cn(
                            "font-semibold text-sm mb-1 transition-colors",
                            theme === "dark"
                              ? "text-white group-hover:text-blue-400"
                              : "text-slate-800 group-hover:text-blue-600",
                          )}
                        >
                          {task.name}
                        </h4>
                        {task.note && (
                          <p className="text-xs text-slate-400 mb-3 leading-relaxed truncate">
                            {task.note}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-600/20">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                              <Clock className="w-3 h-3" />{" "}
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                              <TimerIcon className="w-3 h-3" /> {task.duration}m
                            </span>
                          </div>
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTask(task.id, {
                                status: e.target.value as TaskStatus,
                              })
                            }
                            className="text-[10px] bg-transparent border-none focus:ring-0 text-slate-500 font-bold cursor-pointer"
                          >
                            {columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                {dropTargetIndex?.col === column.id &&
                  dropTargetIndex.index ===
                    state.tasks.filter((t) => t.status === column.id)
                      .length && (
                    <div className="h-1 bg-indigo-500 rounded-full animate-pulse" />
                  )}
                <button
                  onClick={() => openAddModal(column.id)}
                  className={cn(
                    "w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center text-slate-500 transition-all group",
                    theme === "dark"
                      ? "border-slate-700/50 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800"
                      : "border-slate-300 hover:text-indigo-600 hover:border-indigo-500/50 hover:bg-white",
                  )}
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add another card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 group"
      >
        <Bolt className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            className={cn(
              "relative w-full max-w-md rounded-3xl shadow-2xl border p-8 animate-in zoom-in-95 duration-200",
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-100 text-slate-800",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                  Task Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={cn(
                    "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-800",
                  )}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-800",
                    )}
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Priority,
                      })
                    }
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-800",
                    )}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Category,
                      })
                    }
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-800",
                    )}
                  >
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className={cn(
                      "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-800",
                    )}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className={cn(
                    "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-800",
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                  Notes
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows={3}
                  className={cn(
                    "w-full p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-800",
                  )}
                  placeholder="Add some details..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
